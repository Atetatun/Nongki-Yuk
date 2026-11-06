import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export interface CreateEventInput {
  id: string;
  title: string;
  timezone?: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  dayStartMin?: number;
  dayEndMin?: number;
  slotMinutes?: number;
  minDurationMin?: number;
}

/**
 * Elga DAL: Membuat acara baru di database.
 */
export async function buatAcara(input: CreateEventInput) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // Retensi 30 hari

  return await prisma.event.create({
    data: {
      id: input.id,
      title: input.title,
      timezone: input.timezone || 'Asia/Jakarta',
      startDate: new Date(input.startDate),
      endDate: new Date(input.endDate),
      dayStartMin: input.dayStartMin ?? 540,
      dayEndMin: input.dayEndMin ?? 1320,
      slotMinutes: input.slotMinutes ?? 30,
      minDurationMin: input.minDurationMin ?? 120,
      expiresAt: expiresAt,
    },
  });
}

/**
 * Elga DAL: Mengambil detail acara beserta daftar peserta dan slot ketersediaan.
 */
export async function ambilAcara(eventId: string) {
  return await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      participants: {
        include: {
          availabilities: true,
        },
      },
    },
  });
}

/**
 * Elga DAL: Menyimpan atau memperbarui ketersediaan slot waktu partisipan.
 */
export async function simpanKetersediaan(
  eventId: string,
  participantId: string,
  slotStartUtcs: string[]
) {
  // Gunakan transaction agar atomic (hapus yang lama, masukkan yang baru)
  return await prisma.$transaction(async (tx) => {
    // Hapus ketersediaan lama partisipan ini untuk acara tersebut
    await tx.availability.deleteMany({
      where: { participantId },
    });

    // Masukkan slot baru jika ada
    if (slotStartUtcs.length > 0) {
      await tx.availability.createMany({
        data: slotStartUtcs.map((slot) => ({
          participantId,
          eventId,
          slotStartUtc: new Date(slot),
        })),
      });
    }

    // Update timestamp participant
    await tx.participant.update({
      where: { id: participantId },
      data: { updatedAt: new Date() },
    });

    return { success: true, count: slotStartUtcs.length };
  });
}

/**
 * Elga DAL: Helper hash token edit peserta.
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
