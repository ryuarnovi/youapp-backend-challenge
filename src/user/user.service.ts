import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { ProfileDto } from '../dto/profile/profile.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createProfile(userId: string, dto: ProfileDto) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { profile: dto },
      { new: true },
    );
    if (!updatedUser) throw new NotFoundException('User not found');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return updatedUser.profile;
  }

  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return user.profile;
  }

  async updateProfile(userId: string, dto: ProfileDto) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: { profile: { ...dto } } },
      { new: true },
    );
    if (!updatedUser) throw new NotFoundException('User not found');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return updatedUser.profile;
  }
}
