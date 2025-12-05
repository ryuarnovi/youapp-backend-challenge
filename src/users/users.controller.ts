import { Controller, Post, Body, Get, Put, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from '../dto/register/register.dto';
import { LoginDto } from '../dto/login/login.dto';
import { ProfileDto } from '../dto/profile/profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // uncomment when JWT ready
import { UseGuards } from '@nestjs/common';

@UseGuards(JwtAuthGuard)
@Controller('api')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.usersService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.usersService.login(dto);
  }

  //@UseGuards(JwtAuthGuard) // for protection after JWT implemented
  @Post('createProfile')
  createProfile(@Body() dto: ProfileDto) {
    // UserID sebaiknya dari req.user (JWT), sekarang dummy saja
    return this.usersService.createProfile('dummyUserId', dto);
  }

  //@UseGuards(JwtAuthGuard)
  @Get('getProfile')
  getProfile() {
    // return this.usersService.getProfile(req.user.userId);
    return this.usersService.getProfile('dummyUserId');
  }

  //@UseGuards(JwtAuthGuard)
  @Put('updateProfile')
  updateProfile(@Body() dto: ProfileDto) {
    return this.usersService.updateProfile('dummyUserId', dto);
  }
}
