import { promises as fs } from 'fs';
import { join } from 'path';

export const DEFAULT_UPLOADS_DIR = join(process.cwd(), 'uploads');

export function normalizeAvatar(avatar: string): string {
  return avatar
    .replace(/^https?:\/\/[^/]+/i, '')  // прибрати домен
    .replace(/^\/?uploads\/?/i, '')     // прибрати префікс /uploads/
    .replace(/^\/+/, '');               // прибрати початкові слеші
}

/** FS-шлях до файлу аватарки (для перевірки існування) */
export function getAvatarFsPath(fileFromDb: string, uploadsDir = DEFAULT_UPLOADS_DIR): string {
  const cleaned = normalizeAvatar(fileFromDb);
  return join(uploadsDir, cleaned);
}

/** Асинхронна перевірка існування файлу */
export async function fileExists(fsPath: string): Promise<boolean> {
  try {
    await fs.access(fsPath);
    return true;
  } catch {
    return false;
  }
}

export async function buildAvatarUrl(
  fileFromDb: string | null | undefined,
  updatedAt: Date,
  opts?: { absolute?: boolean; baseUrl?: string; uploadsDir?: string }
): Promise<string | null> {
  if (!fileFromDb) return null;

  const uploadsDir = opts?.uploadsDir ?? DEFAULT_UPLOADS_DIR;
  const cleaned = normalizeAvatar(fileFromDb);
  if (!cleaned) return null;

  const fsPath = getAvatarFsPath(cleaned, uploadsDir);
  if (!(await fileExists(fsPath))) return null;

  const v = updatedAt?.getTime?.() ?? Date.now();
  const rel = `/uploads/${cleaned}?v=${v}`;

  if (opts?.absolute) {
    const base = (opts.baseUrl ?? process.env.STATIC_URL ?? '').replace(/\/$/, '');
    return base ? `${base}${rel}` : rel;
  }

  return rel;
}
