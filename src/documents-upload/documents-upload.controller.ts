import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  BadRequestException,
  ValidationPipe,
  Get,
  Param,
  Delete,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { join, basename } from 'path';
import { UploadDocumentsDto } from './dto/upload-doc.dto';
import { DocumentsUploadService } from './documents-upload.service';
import { Response } from 'express';

@Controller('documents')
export class DocumentsUploadController {
  constructor(private readonly documentsUploadService: DocumentsUploadService) {}

  // 🟢 Завантаження документа
  @Post()
  @UseInterceptors(
    FileInterceptor('documents', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/documents';
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const timestamp = Date.now();
          const ext = file.originalname.split('.').pop();
          cb(null, `temp-${timestamp}.${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              `Непідтримуваний тип файлу: ${file.mimetype}. Дозволені типи: PDF, JPG, PNG, WEBP.`,
            ),
            false,
          );
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body(new ValidationPipe()) body: UploadDocumentsDto,
  ) {
    const { companyTitle, documentName, companyId } = body;

    if (!companyId || !companyTitle) {
      throw new BadRequestException('companyId і companyTitle обов’язкові');
    }

    if (!file) {
      throw new BadRequestException('Файл не був завантажений');
    }

    const ext = file.originalname.split('.').pop();
    const safeCompanyTitle = companyTitle.replace(/[^\w\d_-]/g, '_');
    const safeCompanyId = companyId.replace(/[^\w\d_-]/g, '_');

    const newFileName = `${safeCompanyId}_${safeCompanyTitle}-${documentName || Date.now()}.${ext}`;

    this.documentsUploadService.renameFile(file.filename, newFileName);

    return {
      message: '✅ File successfully saved',
      ...this.documentsUploadService.getFileResponse(newFileName),
    };
  }

  // 📂 Отримання всіх документів компанії
  @Get('company/:id')
  getCompanyDocuments(@Param('id') companyId: string) {
    return this.documentsUploadService.getCompanyDocuments(companyId);
  }

  // 📄 Отримання окремого файлу
  @Get(':filename')
  getDocument(@Param('filename') filename: string, @Res() res: Response) {
    const safeFilename = basename(filename); // захист від path traversal
    const filePath = join(process.cwd(), 'uploads', 'documents', safeFilename);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Файл не знайдено');
    }

    return res.sendFile(filePath);
  }

  // 🗑 Видалення файлу
  @Delete(':filename')
  deleteDocument(@Param('filename') filename: string) {
    this.documentsUploadService.removeFile(`/uploads/documents/${filename}`);

    return {
      message: `🗑️ Файл ${filename} успішно видалено`,
    };
  }
}
