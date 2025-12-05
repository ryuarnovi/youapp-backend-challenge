/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ProfileDto } from '../dto/profile/profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Post('createProfile')
  async createProfile(@Request() req, @Body() dto: ProfileDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.log('USER ID:', req.user.userId); // Akan tampil di log server
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return this.userService.createProfile(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getProfile')
  async getProfile(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.log('USER ID:', req.user.userId); // Akan tampil di log server
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return this.userService.getProfile(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('updateProfile')
  async updateProfile(@Request() req, @Body() dto: ProfileDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return this.userService.updateProfile(req.user.userId, dto);
  }
}
