
export interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export class ContactModel {
  private DB_KEY = 'laravel_sim_contacts';

  // Lưu vào Database (LocalStorage)
  async save(data: Omit<ContactData, 'created_at'>): Promise<boolean> {
    try {
      const currentData = JSON.parse(localStorage.getItem(this.DB_KEY) || '[]');
      const newData: ContactData = {
        ...data,
        created_at: new Date().toISOString()
      };
      currentData.push(newData);
      localStorage.setItem(this.DB_KEY, JSON.stringify(currentData));
      return true;
    } catch (e) {
      return false;
    }
  }

  // Lấy tất cả bản ghi
  async all(): Promise<ContactData[]> {
    return JSON.parse(localStorage.getItem(this.DB_KEY) || '[]');
  }
}
