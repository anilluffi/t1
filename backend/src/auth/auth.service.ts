import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailService } from '../mail/mail.service';
import { ChangePasswordDto } from './dto/change-password.dto';
@Injectable()
export class AuthService {
  [x: string]: any;
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private mailService: MailService,
    private jwtService: JwtService
  ) { }

  private async generateTokens(userId: number, email: string) {
    const payload = { sub: userId, email };//////////////////////////
    const access_token = this.jwtService.sign(payload, {
      expiresIn: '15m',
      jwtid: `access-token-${userId}-${Date.now()}`
    });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.usersRepository.update(userId, { refreshToken: refresh_token });

    return { access_token, refresh_token };
  }

  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    const { email, password } = registerDto;
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.usersRepository.create({ ...registerDto, password: hashedPassword });

    await this.usersRepository.save(newUser);

    await this.mailService.sendMail(
      newUser.email,
      'Welcom!',
      `hi, reg sucsses.`,
      ''
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
  async refreshToken(userId: number, token: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    //log
    //console.log("Полученный userId:", userId);
    //console.log("Найденный пользователь:", user);
    //console.log("Refresh Token в БД:", user?.refreshToken);
    //console.log("Refresh Token из запроса:", token);
    if (!user || user.refreshToken !== token) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const newTokens = await this.generateTokens(user.id, user.email);

    // refresh_token в бд
    await this.usersRepository.update(userId, { refreshToken: newTokens.refresh_token });

    return newTokens;
  }
  ////////////////////////////////////////////////////////////////////////////////////
  async logout(userId: number) {
    await this.usersRepository.update(userId, { refreshToken: undefined });
    return { message: 'Logged out successfully' };
  }

  private generateResetToken(userId: number): string {
    const payload = { userId };
    return this.jwtService.sign(payload, { expiresIn: '5m' });
  }



  async resetPasswordMail(dto: ResetPasswordDto) {
    const user = await this.usersRepository.findOne({ where: { email: dto.email } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const token = this.generateResetToken(user.id);
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
    //console.log('start resetPasswordWithToken');
    //console.log('Received token:', token);

    let payload;
    try {
        payload = this.jwtService.verify(token);
       // console.log('Token successfully verified:', payload);
    } catch (error) {
        console.error('Token verification failed:', error);
        throw new UnauthorizedException('Invalid or expired token');
    }

    const user = await this.usersRepository.findOne({ where: { id: payload.userId } });
    if (!user) {
        console.warn('User not found with ID:', payload.userId);
        throw new NotFoundException('User not found');
    }

    //console.log('User found:', user.id);

    user.password = await bcrypt.hash(newPassword, 10);
    //console.log('Password hashed successfully');

    try {
        await this.usersRepository.save(user);
        //console.log('User password successfully updated');
    } catch (error) {
        console.error('Error saving user:', error);
    }

    return { message: 'Password successfully reset' };
}




}
