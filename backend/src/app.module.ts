import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { MailService } from './mail/mail.service';
import { ConfigModule } from '@nestjs/config';
import { FavoriteCityModule } from './favorite-city/favorite-city.module';
import { WeatherModule } from './weather/weather.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1',
      database: 't1_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule,
    FavoriteCityModule,
    WeatherModule,
  ],
  controllers: [AppController],
  providers: [MailService],
})
export class AppModule {}
