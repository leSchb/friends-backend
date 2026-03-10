import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PunishmentsService } from './punishments.service';
import { CreatePunishmentDto, UpdatePunishmentDto } from './dto';
import { JwtAuthGuard } from 'src/auth/guard';

@Controller('punishments')
export class PunishmentsController {
  constructor(private punishmentsService: PunishmentsService) {}

  @Get()
  async getAll() {
    return this.punishmentsService.getPunishments();
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async create(@Req() { user }, @Body() dto: CreatePunishmentDto) {
    return this.punishmentsService.createPunishment(user.id, dto);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.punishmentsService.getPunishmentById(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string) {
    return this.punishmentsService.deletePunishmentById({ uuid: id });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePunishmentDto,
    @Req() { user },
  ) {
    return this.punishmentsService.updatePunishment(id, dto, user.id);
  }
}
