import React, { useState } from "react";
import { Save, UserCircle2 } from "lucide-react";
// Sau này có thể lấy user thật bằng Zustand hoặc API:
// import { useUserStore } from "../../store/userStore";

export default function Profile() {
  // Mock user hiện tại (tạm thời)
  const [user, setUser] = useState({
    id: 1,
    username: "admin",
    full_name: "Administrator",
    email: "admin@example.com",
    role: "Admin",
    avatar_url: "",
  });

  const [formData, setFormData] = useState(user);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Xử lý thay đổi form
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  // Xử lý lưu thông tin
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Giả lập API PUT
      console.log("Cập nhật hồ sơ:", formData);
      setTimeout(() => {
        setUser(formData);
        setSaved(true);
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Có lỗi xảy ra khi cập nhật thông tin!");
    }
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

      {/* Form chính */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Avatar */}
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

          {/* Thông tin cơ bản */}
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
                disabled
                className="w-full rounded-lg border bg-slate-100 px-3 py-2 text-sm text-slate-500 cursor-not-allowed"
              />
            </div>

            {/* Họ và tên */}
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
          <div className="flex justify-end items-center gap-3">
            {saved && (
              <span className="text-green-600 text-sm font-medium">
                ✅ Đã lưu thay đổi thành công
              </span>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white shadow ${
                loading
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-slate-900 hover:bg-slate-800"
              }`}
            >
              <Save className="h-4 w-4" />{" "}
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
