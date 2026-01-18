
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

export class ProductModel {
  // Dữ liệu giả lập trong Database
  private products: Product[] = [
    { id: 1, name: "Laravel Pro Hoodie", price: 450000, category: "Thời trang", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500", description: "Áo hoodie chất lượng cao cho lập trình viên." },
    { id: 2, name: "PHP Artisan Mug", price: 120000, category: "Phụ kiện", image: "https://images.unsplash.com/photo-1514228742587-6b1558fbed39?w=500", description: "Cốc sứ in hình PHP Artisan cực chất." },
    { id: 3, name: "Mechanical Keyboard MVC", price: 2500000, category: "Công nghệ", image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500", description: "Bàn phím cơ tối ưu cho việc gõ code Laravel." },
    { id: 4, name: "Clean Code Book", price: 350000, category: "Sách", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500", description: "Cẩm nang lập trình cho mọi kỹ sư phần mềm." },
    { id: 5, name: "Workspace Desk Lamp", price: 890000, category: "Nội thất", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500", description: "Đèn bàn bảo vệ mắt cho những đêm chạy deadline." },
    { id: 6, name: "Gemini AI Smart Watch", price: 5400000, category: "Công nghệ", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500", description: "Đồng hồ thông minh tích hợp trợ lý AI." }
  ];

  async all(): Promise<Product[]> {
    return this.products;
  }

  async find(id: number): Promise<Product | undefined> {
    return this.products.find(p => p.id === id);
  }

  async filterByCategory(category: string): Promise<Product[]> {
    return this.products.filter(p => p.category === category);
  }
}
