import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
@Module({
  controllers: [WeatherController],
  providers: [WeatherService],
  imports: [AuthModule, JwtModule],
  exports: [WeatherService],
})
export class WeatherModule {}
