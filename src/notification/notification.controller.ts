import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationService } from './notification.service';

@Controller('api')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('getNotification')
  async getNotification(@Req() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const userId = req.user.userId;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.notificationService.getNotifications(userId);
  }
}
