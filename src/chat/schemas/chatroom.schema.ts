import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChatRoomDocument = ChatRoom & Document;

@Schema({ timestamps: true })
export class ChatRoom {
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], required: true })
  members: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Message' }], default: [] })
  messages: Types.ObjectId[];

  @Prop({ default: 'private' })
  type: string;

  @Prop()
  roomName: string;
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
