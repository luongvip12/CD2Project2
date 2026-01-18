
import React, { useState, useMemo } from 'react';
import { ContactController } from '../controllers/ContactController';

const Contact: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  
  const controller = useMemo(() => new ContactController(), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await controller.store(form);
    if (result.success) {
      setStatus({ type: 'success', msg: result.message });
      setForm({ name: '', email: '', subject: '', message: '' });
    } else {
      setStatus({ type: 'error', msg: result.message });
    }
  };

  return (
    <div className="max-w-xl mx-auto py-16 px-4">
      <div className="bg-white rounded-[2rem] shadow-2xl p-10 border border-gray-100">
        <h2 className="text-3xl font-black mb-8 text-center">Liên Hệ <span className="text-red-600">Database</span></h2>
        
        {status && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {status.msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" placeholder="Họ và tên" required
            className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-red-500"
            value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
          />
          <input 
            type="email" placeholder="Email" required
            className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-red-500"
            value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
          />
          <input 
            type="text" placeholder="Chủ đề" required
            className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-red-500"
            value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})}
          />
          <textarea 
            placeholder="Nội dung" required rows={4}
            className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-red-500"
            value={form.message} onChange={(e) => setForm({...form, message: e.target.value})}
          />
          <button className="w-full py-4 bg-red-600 text-white rounded-xl font-bold hover:shadow-xl hover:bg-red-700 transition-all">
            Lưu vào Database
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
