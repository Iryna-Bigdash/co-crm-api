import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  BadRequestException,
  ValidationPipe,
} from '@nestjs/common';
import { UploadFileDto } from './dto/upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { UploadService } from './upload-photos.service';

@Controller('upload')
export class UploadController {
  constructor (private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads';

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
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body(new ValidationPipe()) body: UploadFileDto,
  ) {
    const { companyTitle, documentNumber } = body;

    if (!companyTitle) {
      throw new BadRequestException('companyTitle обов’язковий');
    }

    const ext = file.originalname.split('.').pop();
    const safeCompanyTitle = companyTitle.replace(/\s+/g, '_');
    const newFileName = `${safeCompanyTitle}-${documentNumber || Date.now()}.${ext}`;

    this.uploadService.renameFile(file.filename, newFileName);

    return {
      message: '✅ File successfully saved',
      ...this.uploadService.getFileResponse(newFileName),
    };
  }

  
}
