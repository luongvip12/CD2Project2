
import { ContactModel, ContactData } from '../models/ContactModel';

export class ContactController {
  private contactModel: ContactModel;

  constructor() {
    this.contactModel = new ContactModel();
  }

  async store(data: Omit<ContactData, 'created_at'>): Promise<{ success: boolean; message: string }> {
    // Validation sơ bộ (giống Laravel Validation)
    if (!data.email.includes('@')) {
      return { success: false, message: 'Email không hợp lệ.' };
    }

    const saved = await this.contactModel.save(data);
    if (saved) {
      return { success: true, message: 'Cảm ơn! Thông tin của bạn đã được lưu vào Database.' };
    }
    return { success: false, message: 'Lỗi hệ thống Database.' };
  }
}
