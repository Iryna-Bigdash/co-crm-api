import { Test, TestingModule } from '@nestjs/testing';
import { UploadPhotosController } from './upload-photos.controller';

describe('UploadPhotosController', () => {
  let controller: UploadPhotosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadPhotosController],
    }).compile();

    controller = module.get<UploadPhotosController>(UploadPhotosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
