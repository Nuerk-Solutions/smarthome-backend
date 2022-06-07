import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateYoutubeDto } from './dto/create-youtube.dto';
import { UpdateYoutubeDto } from './dto/update-youtube.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { YouTube, YouTubeDocument } from './schemas/youtube.schema';

@Injectable()
export class YoutubeService {
  constructor(
    @InjectModel(YouTube.name, 'youtube')
    private readonly _youtubeModel: Model<YouTubeDocument>,
  ) {}

  async create(createYoutubeDto: CreateYoutubeDto): Promise<YouTube> {
    return await this._youtubeModel.create(createYoutubeDto);
  }

  async verify(token: String, updateYoutubeDto: UpdateYoutubeDto): Promise<Boolean> {
    const youtube = await this._youtubeModel.findOne({ token });
    if (!youtube)
      throw new ForbiddenException({
        statusCode: 403,
        youtubeCode: 0,
        error: 'Forbidden',
        message: 'Token not found',
      });

    if (!youtube.enabled)
      throw new ForbiddenException({
        statusCode: 403,
        youtubeCode: 1,
        error: 'Forbidden',
        message: 'Token is disabled',
      });

    if (youtube.expiryDate) {
      if (youtube.expiryDate < new Date()) {
        throw new ForbiddenException({
          statusCode: 403,
          youtubeCode: 2,
          error: 'Forbidden',
          message: 'Token is expired',
        });
      }
    }
    if (youtube.systemBind) {
      if (!youtube.hwid) {
        await this._youtubeModel.updateOne({ token }, { hwid: updateYoutubeDto.hwid }).exec();
        return true;
      }
      if (youtube.hwid !== updateYoutubeDto.hwid) {
        throw new ForbiddenException({
          statusCode: 403,
          youtubeCode: 3,
          error: 'Forbidden',
          message: 'Token does not match HWID',
        });
      }
    }
    return true;
  }

  async update(token: string, updateYoutubeDto: UpdateYoutubeDto): Promise<UpdateYoutubeDto> {
    const youtube: YouTube = await this._youtubeModel.findOneAndUpdate({ token }, updateYoutubeDto, { new: true }).exec();
    return {
      hwid: youtube.hwid,
      videoDownloadLength: youtube.videoDownloadLength,
      videoDownloads: youtube.videoDownloads,
    };
  }
}
