import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Notification,
  NotificationDocument,
} from '../chat/schemas/notification.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}

  async getNotifications(userId: string) {
    return this.notificationModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ timestamp: -1 })
      .limit(50)
      .exec();
  }
}
