import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import { CreateYoutubeDto } from './dto/create-youtube.dto';
import { UpdateYoutubeDto } from './dto/update-youtube.dto';
import { Role } from '../authentication/core/enums/role.enum';
import { YouTube } from './schemas/youtube.schema';
import { Authorization } from '../authentication/core/decorators/authorization.decorator';

@Controller('youtube')
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @Authorization(Role.USER)
  @Post()
  async create(@Body() createYoutubeDto: CreateYoutubeDto): Promise<YouTube> {
    return await this.youtubeService.create(createYoutubeDto);
  }

  @Post(':token')
  async verify(@Param('token') token: string, @Body() updateYoutubeDto: UpdateYoutubeDto): Promise<Boolean> {
    return await this.youtubeService.verify(token, updateYoutubeDto);
  }

  @Patch(':token')
  async update(@Param('token') token: string, @Body() updateYoutubeDto: UpdateYoutubeDto): Promise<UpdateYoutubeDto> {
    return await this.youtubeService.update(token, updateYoutubeDto);
  }
}
