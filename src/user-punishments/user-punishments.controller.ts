import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserPunishmentsService } from './user-punishments.service';
import { JwtAuthGuard } from 'src/auth/guard';

@Controller('user-punishments')
export class UserPunishmentsController {
  constructor(private punishmentsService: UserPunishmentsService) {}

  @Get('random')
  @UseGuards(JwtAuthGuard)
  async assignRandom(@Req() { user }) {
    return this.punishmentsService.assignRandomPunishment(user.id);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMy(@Req() { user }) {
    return this.punishmentsService.getUserPunishments(user.id);
  }
}
