import { Module } from '@nestjs/common';
import { UploadService } from './upload-photos.service';
import { UploadController } from './upload-photos.controller';

@Module({
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}


