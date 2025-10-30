import React, { useState } from "react";
import { Save, UserCircle2 } from "lucide-react";
// Sau này bạn có thể lấy user từ Zustand:
// import { useUserStore } from "../../store/userStore";

export default function Profile() {
  // Mock user hiện tại (sau này thay bằng Zustand hoặc API)
  const [user, setUser] = useState({
    username: "admin",
    full_name: "Administrator",
    email: "admin@example.com",
    role: "Admin",
    avatar_url: "",
  });

  const [formData, setFormData] = useState(user);
  const [saved, setSaved] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Cập nhật hồ sơ:", formData);
    setUser(formData);
    setSaved(true);
    alert("Cập nhật thông tin cá nhân thành công!");
  };

  return (
    <div className="space-y-8">
      {/* Tiêu đề */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Hồ sơ cá nhân</h1>
        <p className="text-slate-500 text-sm mt-1">
          Xem và chỉnh sửa thông tin tài khoản của bạn.
        </p>
      </div>

      {/* Thông tin cơ bản */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center text-center space-y-3">
            {formData.avatar_url ? (
              <img
                src={formData.avatar_url}
                alt="avatar"
                className="h-24 w-24 rounded-full object-cover border"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-100">
                <UserCircle2 className="h-12 w-12 text-slate-400" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Ảnh đại diện (URL)
              </label>
              <input
                type="text"
                name="avatar_url"
                value={formData.avatar_url}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
                className="w-80 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Tên đăng nhập */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tên đăng nhập
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled
                className="w-full rounded-lg border bg-slate-100 px-3 py-2 text-sm text-slate-500 cursor-not-allowed"
              />
            </div>

            {/* Họ tên */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Họ và tên
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>

            {/* Vai trò */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Vai trò
              </label>
              <input
                type="text"
                value={formData.role}
                readOnly
                className="w-full rounded-lg border bg-slate-100 px-3 py-2 text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Nút lưu */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-slate-800"
            >
              <Save className="h-4 w-4" /> Lưu thay đổi
            </button>
          </div>

          {saved && (
            <p className="text-green-600 text-sm font-medium text-right">
              ✅ Đã lưu thay đổi thành công
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
