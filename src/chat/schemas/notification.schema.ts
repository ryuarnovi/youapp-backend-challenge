import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Notification {
  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId; // Tipe ObjectId agar bisa filter dengan id user MongoDB

  @Prop({ required: true })
  title: string; // Misal: "New Message"

  @Prop({ required: true })
  message: string;

  @Prop({ default: false })
  isRead: boolean; // Status sudah dibaca

  @Prop({ default: Date.now })
  timestamp: Date;
}

export type NotificationDocument = Notification & Document;
export const NotificationSchema = SchemaFactory.createForClass(Notification);
