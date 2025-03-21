import { Controller, Get, UseGuards } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller('api')
export class AppController {
  @Get('message')
  @UseGuards(JwtAuthGuard) // 🔒
  getMessage() {
    return { message: '^^' };
  }
}
