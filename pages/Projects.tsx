
import React, { useState, useMemo, useRef } from 'react';
import { ProjectController } from '../controllers/ProjectController';

const Projects: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const controller = useMemo(() => new ProjectController(), []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const processAction = async () => {
    if (!image || !prompt) return;
    setLoading(true);
    try {
      const edited = await controller.handleImageEdit(image, prompt);
      setResult(edited);
    } catch (e) {
      alert("Controller Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Dự Án AI <span className="text-red-600">Controller</span></h1>
        <p className="text-gray-500">Thử nghiệm xử lý ảnh thông qua tầng nghiệp vụ Controller và AI Model.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div 
            onClick={() => fileInput.current?.click()}
            className="aspect-video bg-gray-100 rounded-3xl border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-all overflow-hidden"
          >
            {image ? <img src={image} className="w-full h-full object-cover" /> : <p className="text-gray-400">Chọn ảnh nguồn</p>}
            <input type="file" ref={fileInput} onChange={onFileChange} className="hidden" accept="image/*" />
          </div>

          <textarea 
            className="w-full p-4 rounded-2xl border-gray-200 focus:ring-red-500 min-h-[120px]"
            placeholder="Mô tả thay đổi bạn muốn thực hiện..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <button 
            onClick={processAction}
            disabled={loading || !image}
            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-red-600 transition-all disabled:opacity-50"
          >
            {loading ? 'AI is thinking...' : 'Gửi lệnh cho Controller'}
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-4 flex flex-col items-center justify-center">
          {result ? (
            <div className="w-full h-full flex flex-col items-center">
              <img src={result} className="max-h-[400px] rounded-xl shadow-lg" />
              <p className="mt-4 text-sm text-green-600 font-bold">Xử lý thành công!</p>
            </div>
          ) : (
            <p className="text-gray-300 italic">Kết quả từ AI Model sẽ xuất hiện ở đây</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
