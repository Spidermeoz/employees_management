import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeftCircle } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <div className="mb-6">
        <h1 className="text-[100px] font-extrabold text-slate-200 leading-none">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-slate-800">
          Ôi không! Trang bạn tìm không tồn tại 😢
        </h2>
        <p className="mt-2 text-slate-500 text-sm max-w-md">
          Có thể đường dẫn đã bị thay đổi hoặc bạn không có quyền truy cập.  
          Vui lòng quay lại trang chính để tiếp tục.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeftCircle className="h-4 w-4" />
          Quay lại
        </button>
        <button
          onClick={() => navigate("/app/dashboard")}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow hover:bg-slate-800"
        >
          <Home className="h-4 w-4" />
          Về trang chính
        </button>
      </div>
    </div>
  );
}
