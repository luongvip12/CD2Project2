
import { ProductModel, Product } from '../models/ProductModel';

export class ShopController {
  private productModel: ProductModel;

  constructor() {
    this.productModel = new ProductModel();
  }

  // Tương đương public function index()
  async index(): Promise<Product[]> {
    return await this.productModel.all();
  }

  // Tương đương public function show($id)
  async show(id: number): Promise<Product | undefined> {
    return await this.productModel.find(id);
  }
}
