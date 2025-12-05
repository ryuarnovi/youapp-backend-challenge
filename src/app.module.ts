import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    // Load environment variables
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // MongoDB connection
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/youapp',
    ),

    // Feature modules
    UserModule,
    AuthModule,
    ChatModule,
    NotificationModule,
  ],
})
export class AppModule {}
