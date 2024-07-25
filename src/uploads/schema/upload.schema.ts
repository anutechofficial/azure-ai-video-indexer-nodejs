import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Uploads {
  @Prop()
  name: string;

  @Prop()
  url: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: 'user', enum: ['user', 'admin'] })
  type: string;
}

export const UploadSchema = SchemaFactory.createForClass(Uploads);
