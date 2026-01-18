
import React, { useState, useMemo, useRef } from 'react';
import { HomeController } from '../controllers/HomeController';
import { ProjectController } from '../controllers/ProjectController';

const AITools: React.FC = () => {
  // Logic Tìm kiếm
  const [query, setQuery] = useState('');
  const [searchData, setSearchData] = useState<any>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  
  // Logic Chỉnh sửa ảnh
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [imageResult, setImageResult] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const homeController = useMemo(() => new HomeController(), []);
  const projectController = useMemo(() => new ProjectController(), []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchLoading(true);
    try {
      const result = await homeController.search(query);
      setSearchData(result);
    } catch (error) {
      alert("Search error");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!image || !prompt) return;
    setImageLoading(true);
    try {
      const result = await projectController.handleImageEdit(image, prompt);
      setImageResult(result);
    } catch (e) {
      alert("AI Image error");
    } finally {
      setImageLoading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-16 px-4">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black mb-4 uppercase">AI Lab Center</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">Sử dụng sức mạnh từ Gemini AI để tối ưu hóa trải nghiệm của bạn. Tất cả được xử lý thông qua tầng Controller chuẩn.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Tính năng 1: Tìm kiếm Grounding */}
        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100">
           <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 mb-6 font-bold text-xl">01</div>
           <h2 className="text-2xl font-black mb-4">Tra cứu sản phẩm thông minh</h2>
           <p className="text-gray-500 mb-8 text-sm">Tìm kiếm thông tin thực tế từ web để đưa ra quyết định mua sắm đúng đắn nhất.</p>
           
           <form onSubmit={handleSearch} className="space-y-4">
              <input 
                type="text" placeholder="Hỏi AI bất cứ điều gì về sản phẩm..."
                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500"
                value={query} onChange={(e) => setQuery(e.target.value)}
              />
              <button className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100" disabled={searchLoading}>
                {searchLoading ? 'Đang tra cứu...' : 'Gửi yêu cầu'}
              </button>
           </form>

           {searchData && (
             <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-100 text-sm leading-relaxed text-gray-700">
                {searchData.text}
             </div>
           )}
        </div>

        {/* Tính năng 2: Chỉnh sửa ảnh AI */}
        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100">
           <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-900 mb-6 font-bold text-xl">02</div>
           <h2 className="text-2xl font-black mb-4">Magic Image Editor</h2>
           <p className="text-gray-500 mb-8 text-sm">Thay đổi màu sắc, thêm chi tiết hoặc xóa vật thể trong ảnh sản phẩm của bạn.</p>

           <div className="space-y-4">
              <div 
                onClick={() => fileInput.current?.click()}
                className="h-48 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer overflow-hidden"
              >
                {image ? <img src={image} className="w-full h-full object-cover" /> : <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Tải ảnh lên</span>}
                <input type="file" ref={fileInput} className="hidden" onChange={onFileChange} accept="image/*" />
              </div>
              
              <input 
                type="text" placeholder="Ví dụ: Đổi màu áo thành màu xanh..."
                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500"
                value={prompt} onChange={(e) => setPrompt(e.target.value)}
              />

              <button 
                onClick={handleEdit}
                disabled={imageLoading || !image}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg"
              >
                {imageLoading ? 'AI đang vẽ...' : 'Xử lý hình ảnh'}
              </button>
           </div>

           {imageResult && (
             <div className="mt-8 animate-fade-in text-center">
                <img src={imageResult} className="max-h-64 mx-auto rounded-2xl shadow-lg border-4 border-white" />
                <p className="mt-2 text-[10px] font-bold text-green-600 uppercase">Hoàn tất!</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default AITools;
