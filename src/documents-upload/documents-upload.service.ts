import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import { join, basename } from 'path';

@Injectable()
export class DocumentsUploadService {
  private readonly uploadDir = join(process.cwd(), 'uploads', 'documents');

  getFileResponse(filename: string) {
    return {
      filename,
      url: `/uploads/documents/${filename}`, // саме так, бо роздається як статична папка
    };
  }

  getCompanyDocuments(companyId: string) {
    const safeCompanyId = companyId.replace(/[^\w\d_-]/g, '_');
  
    if (!fs.existsSync(this.uploadDir)) return [];
  
    const allFiles = fs.readdirSync(this.uploadDir);
  
    const matchedFiles = allFiles.filter((file) =>
      file.startsWith(`${safeCompanyId}_`)
    );
  
    return matchedFiles.map((filename) => this.getFileResponse(filename));
  }

  // 🔄 Перейменовує тимчасовий файл у підсумковий
  renameFile(oldFilename: string, newFilename: string): void {
    const oldPath = join(this.uploadDir, basename(oldFilename));
    const newPath = join(this.uploadDir, basename(newFilename));

    if (!fs.existsSync(oldPath)) {
      throw new NotFoundException(`Файл ${oldFilename} не знайдено`);
    }

    fs.renameSync(oldPath, newPath);
  }

  // 🗑 Видаляє файл
  removeFile(documentUrl: string): void {
    const filename = basename(documentUrl); // захист від path traversal
    const filePath = join(this.uploadDir, filename);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`Файл ${filename} не знайдено`);
    }

    fs.unlinkSync(filePath);
  }
}
