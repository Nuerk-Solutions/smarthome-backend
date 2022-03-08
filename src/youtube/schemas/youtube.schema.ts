import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as crypto from 'crypto';

export type YouTubeDocument = YouTube & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class YouTube {
  @Prop({
    type: String,
  })
  username: string;

  @Prop({
    type: Boolean,
  })
  enabled: boolean;

  @Prop({
    type: String,
    default: () => crypto.randomBytes(16).toString('hex'),
  })
  token: string;

  @Prop({
    type: Date,
    default: null,
  })
  expiryDate: Date;

  @Prop({
    type: String,
  })
  hwid: string;

  @Prop({
    type: Boolean,
  })
  systemBind: boolean;

  @Prop({
    type: Number,
    default: 0,
  })
  videoDownloads: Number;

  @Prop({
    type: Number,
    default: 0,
  })
  videoDownloadLength: Number;
}

export const YouTubeSchema = SchemaFactory.createForClass(YouTube);
