import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ClientProxy } from '@nestjs/microservices';
import { Message, MessageDocument } from './schemas/message.schema';
import {
  Notification,
  NotificationDocument,
} from './schemas/notification.schema';
import { SendMessageDto } from './dto/message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    @Inject('CHAT_SERVICE') private rabbitClient: ClientProxy,
  ) {}

  async sendMessage(senderId: string, dto: SendMessageDto) {
    // 1. Simpan pesan ke database
    const message = new this.messageModel({
      senderId: new Types.ObjectId(senderId),
      receiverId: new Types.ObjectId(dto.receiverId),
      content: dto.content,
      timestamp: new Date(),
      isRead: false,
    });
    const savedMessage = await message.save();

    // 2. Buat notifikasi untuk penerima
    const notification = new this.notificationModel({
      userId: new Types.ObjectId(dto.receiverId),
      title: 'New Message',
      message: `You have a new message`,
      isRead: false,
      timestamp: new Date(),
    });
    await notification.save();

    // 3.  Publish ke RabbitMQ
    this.rabbitClient.emit('new_message', {
      senderId,
      receiverId: dto.receiverId,
      content: dto.content,
      timestamp: savedMessage.timestamp,
    });

    return {
      message: 'Message sent successfully',
      data: savedMessage,
    };
  }

  async viewMessages(userId: string, partnerId: string) {
    const messages = await this.messageModel
      .find({
        $or: [
          {
            senderId: new Types.ObjectId(userId),
            receiverId: new Types.ObjectId(partnerId),
          },
          {
            senderId: new Types.ObjectId(partnerId),
            receiverId: new Types.ObjectId(userId),
          },
        ],
      })
      .sort({ timestamp: 1 })
      .exec();

    // Mark messages as read
    await this.messageModel.updateMany(
      {
        senderId: new Types.ObjectId(partnerId),
        receiverId: new Types.ObjectId(userId),
        isRead: false,
      },
      { isRead: true },
    );

    return messages;
  }

  async getConversations(userId: string) {
    const userObjectId = new Types.ObjectId(userId);

    const conversations = await this.messageModel.aggregate([
      {
        $match: {
          $or: [{ senderId: userObjectId }, { receiverId: userObjectId }],
        },
      },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$senderId', userObjectId] },
              '$receiverId',
              '$senderId',
            ],
          },
          lastMessage: { $first: '$content' },
          lastTimestamp: { $first: '$timestamp' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$receiverId', userObjectId] },
                    { $eq: ['$isRead', false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { lastTimestamp: -1 } },
    ]);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return conversations;
  }
}
