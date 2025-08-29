import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { UpdateInteractionDto } from './dto/update-interaction.dto';
import { ListInteractionsDto } from './dto/list-interactions.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class InteractionsService {
  constructor(private readonly db: DatabaseService) {}

  private async ensureCompanyExists(companyId: string) {
    const company = await this.db.company.findUnique({ where: { id: companyId } });
    if (!company) throw new NotFoundException(`Company ${companyId} not found`);
  }

  async create(companyId: string, dto: CreateInteractionDto) {
    await this.ensureCompanyExists(companyId);

    return this.db.interaction.create({
      data: {
        companyId,
        type: dto.type,
        status: dto.status,
        date: new Date(dto.date),
        comment: dto.comment,
        nextCall: dto.nextCall ? new Date(dto.nextCall) : null,
        amount: dto.amount ?? null,
      },
    });
  }

  async findByCompany(companyId: string, q: ListInteractionsDto) {
    await this.ensureCompanyExists(companyId);

    const where: Prisma.InteractionWhereInput = {
      companyId,
      type: q.type,
      status: q.status,
      AND: [
        q.dateFrom ? { date: { gte: new Date(q.dateFrom) } } : {},
        q.dateTo ?   { date: { lte: new Date(q.dateTo) } }   : {},
      ],
    };

    const [items, total] = await this.db.$transaction([
      this.db.interaction.findMany({
        where,
        orderBy: { date: 'desc' },
        skip: q.skip ?? 0,
        take: q.take ?? 20,
      }),
      this.db.interaction.count({ where }),
    ]);

    return { items, total, skip: q.skip ?? 0, take: q.take ?? 20 };
  }

  async findOne(id: string) {
    const item = await this.db.interaction.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Interaction not found');
    return item;
  }

  async update(id: string, dto: UpdateInteractionDto) {
    await this.findOne(id); // кине 404 якщо нема
    return this.db.interaction.update({
      where: { id },
      data: {
        ...(dto.type && { type: dto.type }),
        ...(dto.status && { status: dto.status }),
        ...(dto.date && { date: new Date(dto.date) }),
        ...(dto.comment && { comment: dto.comment }),
        ...(dto.nextCall !== undefined && { nextCall: dto.nextCall ? new Date(dto.nextCall) : null }),
        ...(dto.amount !== undefined && { amount: dto.amount }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.db.interaction.delete({ where: { id } });
    return { ok: true };
  }
}
