
import { SearchModel, SearchResult } from '../models/SearchModel';

export class HomeController {
  private searchModel: SearchModel;

  constructor() {
    this.searchModel = new SearchModel();
  }

  /**
   * Phương thức xử lý yêu cầu tìm kiếm
   * Tương đương với public function search(Request $request) trong Laravel
   */
  async search(query: string): Promise<SearchResult> {
    if (!query) throw new Error("Query required");
    // Controller gọi Model để lấy dữ liệu
    return await this.searchModel.findByQuery(query);
  }
}
