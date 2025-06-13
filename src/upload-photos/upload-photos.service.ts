import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class UploadService {
  getFileResponse(filename: string) {
    return {
      filename,
      path: `/uploads/${filename}`,
    };
  }

  renameFile(oldFilename: string, newFilename: string): void {
    const uploadDir = join(process.cwd(), 'uploads');
    const oldPath = join(uploadDir, oldFilename);
    const newPath = join(uploadDir, newFilename);

    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
    } else {
      throw new Error(`File ${oldFilename} не знайдено`);
    }
  }

  removeAvatar(avatarUrl: string): void {
    const uploadDir = join(process.cwd(), 'uploads');

    const filename = avatarUrl.split('/').pop();
    if (!filename) {
      throw new Error('Невалідне посилання на файл');
    }

    const filePath = join(uploadDir, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    } else {
      throw new Error(`Файл ${filename} не знайдено`);
    }
  }
}
