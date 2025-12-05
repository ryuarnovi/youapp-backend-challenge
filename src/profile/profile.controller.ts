import { Controller, Get, Query } from '@nestjs/common';

@Controller('profile')
export class ProfileController {
  @Get()
  findAll(@Query('age') age?: string) {
    return [{ name: 'John Doe', age: age ? parseInt(age, 10) : 30 }];
  }
}
