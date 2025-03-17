import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt'; 
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';
import { MailModule } from '../mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { FavoriteCity } from '../favorite-city/favorite-city.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, FavoriteCity]),
    MailModule,
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    JwtModule.register({
      secret: process.env.JWT_REFRESH_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, JwtModule], 
})
export class AuthModule {}
