import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { Message, MessageSchema } from './schemas/message.schema';
import { ChatRoom, ChatRoomSchema } from './schemas/chatroom.schema';
import {
  Notification,
  NotificationSchema,
} from './schemas/notification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: ChatRoom.name, schema: ChatRoomSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
    ClientsModule.register([
      {
        name: 'CHAT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: 'chat_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
