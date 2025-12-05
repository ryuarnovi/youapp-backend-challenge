/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../dto/register/register.dto';
import { LoginDto } from '../dto/login/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.userModel.findOne({
      $or: [{ email: dto.email }, { username: dto.username }],
    });
    if (exists) {
      throw new ConflictException('User already exists');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const hash = await bcrypt.hash(dto.password, 10);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const user = new this.userModel({ ...dto, password: hash });
    await user.save();
    return { message: 'User registered successfully' };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ email: dto.email }).exec();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const payload = { username: user.get('username'), sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
