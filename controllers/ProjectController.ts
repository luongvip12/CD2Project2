
import { ImageModel } from '../models/ImageModel';

export class ProjectController {
  private imageModel: ImageModel;

  constructor() {
    this.imageModel = new ImageModel();
  }

  async handleImageEdit(image: string, prompt: string): Promise<string | null> {
    // Trích xuất dữ liệu thô
    const base64Data = image.split(',')[1];
    // Controller xử lý luồng logic qua Model
    return await this.imageModel.processEdit(base64Data, prompt);
  }
}
