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
    const punishments = await this.punishmentsService.getPunishments();
    return { data: punishments };
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async create(@Req() { user }, @Body() dto: CreatePunishmentDto) {
    const punishment = await this.punishmentsService.createPunishment(
      user.id,
      dto,
    );
    return { data: punishment };
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const punishment = await this.punishmentsService.getPunishmentById(id);
    return { data: punishment };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string) {
    const deleted = await this.punishmentsService.deletePunishmentById({
      uuid: id,
    });
    return { data: deleted };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePunishmentDto,
    @Req() { user },
  ) {
    const punishment = await this.punishmentsService.updatePunishment(
      id,
      dto,
      user.id,
    );
    return { data: punishment };
  }
}
