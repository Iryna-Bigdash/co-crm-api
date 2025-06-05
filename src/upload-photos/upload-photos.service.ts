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
}
