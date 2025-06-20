import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsUploadController } from './documents-upload.controller';

describe('DocumentsUploadController', () => {
  let controller: DocumentsUploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsUploadController],
    }).compile();

    controller = module.get<DocumentsUploadController>(DocumentsUploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
