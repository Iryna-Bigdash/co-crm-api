import { Module } from '@nestjs/common';
import { DocumentsUploadService } from './documents-upload.service';
import { DocumentsUploadController } from './documents-upload.controller';

@Module({
  providers: [DocumentsUploadService],
  controllers: [DocumentsUploadController],
})
export class DocumentsUploadModule {}
