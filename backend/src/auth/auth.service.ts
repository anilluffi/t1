import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { FavoriteCity } from '../favorite-city/favorite-city.entity';
import * as path from 'path';
import * as fs from 'fs';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class AuthService {
  [x: string]: any;
  constructor(
    @InjectRepository(FavoriteCity)
    private favoriteCityRepository: Repository<FavoriteCity>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    private mailService: MailService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private async generateTokens(userId: number, email: string) {
    const payload = { sub: userId, email }; //////////////////////////
    const access_token = this.jwtService.sign(payload, {
      expiresIn: '15m',
      jwtid: `access-token-${userId}-${Date.now()}`,
    });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.usersRepository.update(userId, { refreshToken: refresh_token });

    return { access_token, refresh_token };
  }

  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    const { email, password } = registerDto;
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.usersRepository.create({
      ...registerDto,
      password: hashedPassword,
    });

    await this.usersRepository.save(newUser);

    await this.mailService.sendMail(
      newUser.email,
      'Welcom!',
      `hi, reg sucsses.`,
      '',
    );
    return { message: 'User registered successfully' };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.generateTokens(user.id, user.email);
  }

  ////////////////////////////////////////////////////////////////////////////////
  async refreshToken(refreshToken: string) {
    try {
      const refreshSecret =
        this.configService.get<string>('JWT_REFRESH_SECRET');

      //console.log('JWT_REFRESH_SECRET:', refreshSecret);

      if (!refreshSecret)
        throw new Error('Не удалось получить JWT_REFRESH_SECRET');

      const payload = this.jwtService.verify(refreshToken, {
        secret: refreshSecret,
      });

      const user = await this.usersRepository.findOne({
        where: { id: payload.sub },
      });
      if (!user) throw new UnauthorizedException('User not found');

      const newAccessToken = this.jwtService.sign(
        { sub: user.id, email: user.email },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '15m',
        },
      );

      const newRefreshToken = this.jwtService.sign(
        { sub: user.id },
        { secret: refreshSecret, expiresIn: '7d' },
      );

      await this.usersRepository.update(user.id, {
        refreshToken: newRefreshToken,
      });

      return { access_token: newAccessToken, refresh_token: newRefreshToken };
    } catch (error) {
      console.error('Error refrash token:', error.message);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getProfile(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['favoriteCities'],
    });

    if (!user) throw new NotFoundException(' Пользователь не найден');

    //console.log('USER найден:', user);
    return user;
  }

  private getMimeType(base64: string): string {
    const match = base64.match(/^data:(.+);base64,/);
    if (match) return match[1];

    // Определяем тип по сигнатуре base64
    const signatures: { [key: string]: string } = {
      iVBORw: 'image/png',
      '/9j/4': 'image/jpeg',
      UE5H: 'image/png',
    };

    for (const [signature, mime] of Object.entries(signatures)) {
      if (base64.startsWith(signature)) return mime;
    }

    return '';
  }

  // async getAvatar(userId: number): Promise<string | null> {
  //   const user = await this.usersRepository.findOne({ where: { id: userId } });

  //   if (!user) return null;

  //   const extension = user.avatar ? path.extname(user.avatar) : '.jpg';

  //   const relativePath = `uploads/avatar_${userId}${extension}`;

  //   if (!user.avatar) {
  //     await this.usersRepository.update(userId, { avatar: relativePath });
  //   }

  //   const avatarPath = path.join(__dirname, '..', 'dist', user.avatar);

  //   console.log('Avatar path:', avatarPath);

  //   if (fs.existsSync(avatarPath)) {
  //     console.log('Avatar path found:', avatarPath);
  //     return avatarPath;
  //   }

  //   return null;
  // }

  async setAvatar(userId: number, file: Express.Multer.File) {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('! PNG, JPEG, JPG');
    }

    const extension = path.extname(file.originalname);
    const uploadsDir = path.join(__dirname, '..', 'uploads');

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, `avatar_${userId}${extension}`);
    fs.writeFileSync(filePath, file.buffer);

    const relativePath = `uploads/avatar_${userId}${extension}`;
    await this.usersRepository.update(userId, { avatar: relativePath });

    return { avatarPath: relativePath };
  }

  async logout(userId: number) {
    await this.usersRepository.update(userId, { refreshToken: undefined });
    return { message: 'Logged out successfully' };
  }

  private generateResetToken(userId: number): string {
    const payload = { userId };
    return this.jwtService.sign(payload, { expiresIn: '5m' });
  }

  async resetPasswordMail(dto: ResetPasswordDto) {
    const user = await this.usersRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const token = this.generateResetToken(user.id);

    // mailToken в бд
    await this.usersRepository.update(user.id, { mailToken: token });

    const resetUrl = `http://localhost:3001/reset-password?token=${token}`;

    if (!user) {
      throw new NotFoundException('User not found');
    }

    //user.password = await bcrypt.hash(dto.password, 10);
    //await this.usersRepository.save(user);

    const html = `
      <p>the link is valid for 5 minutes</p>
      <p>Click the button below to reset your password.:</p>
      <a href="${resetUrl}" style="background-color: orange; color: white; padding: 10px 20px; text-decoration: none;">Reset Password</a>
      
    `;

    await this.mailService.sendMail(user.email, 'Reset Password', 'link', html);

    return { message: 'Password successfully changed' };
  }

  async resetPasswordWithToken(token: string, newPassword: string) {
    let payload;
    try {
      payload = this.jwtService.verify(token);
    } catch (error) {
      console.error('Token verification failed:', error);
      throw new UnauthorizedException('Invalid or expired token');
    }

    const user = await this.usersRepository.findOne({
      where: { id: payload.userId },
    });
    if (!user) {
      console.warn('User not found with ID:', payload.userId);
      throw new NotFoundException('User not found');
    }

    if (user.mailToken !== token) {
      //console.warn('Token mismatch for user:', user.id);
      throw new UnauthorizedException('Invalid token');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.mailToken = null;
    try {
      await this.usersRepository.save(user);
    } catch (error) {
      console.error('Error saving user:', error);
    }

    return { message: 'Password successfully reset' };
  }
}
