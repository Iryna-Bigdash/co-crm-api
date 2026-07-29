import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { UpdateInteractionDto } from './dto/update-interaction.dto';
import { ListInteractionsDto } from './dto/list-interactions.dto';
import { CalendarInteractionsDto } from './dto/calendar-interactions.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class InteractionsService {
  private static readonly TIME_INTERVAL_MINUTES = 15;

  constructor(private readonly db: DatabaseService) {}

  private floorToTimeSlot(date: Date): Date {
    const slot = new Date(date);
    slot.setSeconds(0, 0);
    slot.setMilliseconds(0);
    const remainder = slot.getMinutes() % InteractionsService.TIME_INTERVAL_MINUTES;
    slot.setMinutes(slot.getMinutes() - remainder);
    return slot;
  }

  private async assertNextCallSlotAvailable(
    companyId: string,
    nextCall: Date,
    excludeInteractionId?: string,
  ) {
    const assignments = await this.db.employeeCompany.findMany({
      where: { companyId },
      select: { employeeId: true },
    });

    const employeeIds = assignments.map(({ employeeId }) => employeeId);
    if (employeeIds.length === 0) {
      return;
    }

    const slotStart = this.floorToTimeSlot(nextCall);
    const slotEnd = new Date(
      slotStart.getTime() + InteractionsService.TIME_INTERVAL_MINUTES * 60_000,
    );

    const conflict = await this.db.interaction.findFirst({
      where: {
        ...(excludeInteractionId ? { id: { not: excludeInteractionId } } : {}),
        status: 'PENDING',
        nextCall: {
          gte: slotStart,
          lt: slotEnd,
        },
        company: {
          employees: {
            some: { employeeId: { in: employeeIds } },
          },
        },
      },
      include: {
        company: { select: { title: true } },
      },
    });

    if (conflict) {
      throw new ConflictException('Цей час уже зайнятий іншою подією');
    }
  }

  private async ensureCompanyExists(companyId: string) {
    const company = await this.db.company.findUnique({ where: { id: companyId } });
    if (!company) throw new NotFoundException(`Company ${companyId} not found`);
  }

  async create(companyId: string, dto: CreateInteractionDto) {
    await this.ensureCompanyExists(companyId);

    if (dto.nextCall && dto.status === 'PENDING') {
      await this.assertNextCallSlotAvailable(companyId, new Date(dto.nextCall));
    }

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

  async findAll(query: CalendarInteractionsDto = {}) {
    const where: Prisma.InteractionWhereInput = {
      nextCall: { not: null },
    };

    if (query.employeeId) {
      where.company = {
        employees: {
          some: { employeeId: query.employeeId },
        },
      };
    }

    if (query.type) {
      where.type = query.type;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.dateFrom || query.dateTo) {
      where.nextCall = {
        not: null,
        ...(query.dateFrom ? { gte: new Date(query.dateFrom) } : {}),
        ...(query.dateTo ? { lte: new Date(query.dateTo) } : {}),
      };
    }

    const interactions = await this.db.interaction.findMany({
      where,
      orderBy: { nextCall: 'asc' },
      include: {
        company: { select: { title: true } },
      },
    });

    return interactions.map((interaction) => ({
      id: interaction.id,
      companyId: interaction.companyId,
      companyTitle: interaction.company.title,
      type: interaction.type,
      status: interaction.status,
      date: interaction.date,
      comment: interaction.comment,
      nextCall: interaction.nextCall,
      amount: interaction.amount,
      createdAt: interaction.createdAt,
      updatedAt: interaction.updatedAt,
    }));
  }

  async findOne(id: string) {
    const item = await this.db.interaction.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Interaction not found');
    return item;
  }

  async update(id: string, dto: UpdateInteractionDto) {
    const existing = await this.findOne(id);

    const nextCall =
      dto.nextCall !== undefined
        ? dto.nextCall
          ? new Date(dto.nextCall)
          : null
        : existing.nextCall;
    const status = dto.status ?? existing.status;

    if (nextCall && status === 'PENDING') {
      await this.assertNextCallSlotAvailable(existing.companyId, nextCall, id);
    }

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
