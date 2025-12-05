import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/message.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('sendMessage')
  sendMessage(@Request() req, @Body() dto: SendMessageDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.chatService.sendMessage(req.user.userId, dto);
  }

  @Get('viewMessages')
  viewMessages(@Request() req, @Query('partnerId') partnerId: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.chatService.viewMessages(req.user.userId, partnerId);
  }

  @Get('conversations')
  getConversations(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.chatService.getConversations(req.user.userId);
  }
}
