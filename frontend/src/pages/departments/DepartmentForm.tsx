import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import departmentsData from "../../mock/departments.json";

interface Department {
  id: number;
  name: string;
  description?: string;
  manager_name?: string;
  phone?: string;
  email?: string;
  created_at?: string;
}

export default function DepartmentForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<Department>({
    id: Date.now(),
    name: "",
    description: "",
    manager_name: "",
    phone: "",
    email: "",
    created_at: new Date().toISOString(),
  });

  useEffect(() => {
    if (isEdit) {
      const found = (departmentsData as Department[]).find(
        (d) => d.id === Number(id)
      );
      if (found) setFormData(found);
    }
  }, [id, isEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên phòng ban!");
      return;
    }

    console.log(isEdit ? "Cập nhật:" : "Thêm mới:", formData);
    alert(
      isEdit
        ? "Cập nhật thông tin phòng ban thành công!"
        : "Thêm phòng ban mới thành công!"
    );
    navigate("/app/departments");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách
        </button>
        <h1 className="text-2xl font-semibold text-slate-800">
          {isEdit ? "Chỉnh sửa phòng ban" : "Thêm phòng ban mới"}
        </h1>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6"
      >
        {/* Tên phòng ban */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Tên phòng ban <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
            placeholder="VD: Phòng Công nghệ thông tin"
          />
        </div>

        {/* Mô tả */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Mô tả chức năng
          </label>
          <textarea
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300 resize-none"
            placeholder="Mô tả chức năng, nhiệm vụ của phòng ban..."
          />
        </div>

        {/* Trưởng phòng */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Trưởng phòng / Quản lý phụ trách
          </label>
          <input
            type="text"
            name="manager_name"
            value={formData.manager_name || ""}
            onChange={handleChange}
            placeholder="VD: Nguyễn Văn A"
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>

        {/* Liên hệ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Điện thoại */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Số điện thoại
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              placeholder="VD: 0901234567"
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email liên hệ
            </label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              placeholder="VD: it@company.com"
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>
        </div>

        {/* Ngày tạo */}
        {isEdit && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Ngày tạo
            </label>
            <input
              type="text"
              value={
                formData.created_at
                  ? new Date(formData.created_at).toLocaleString("vi-VN")
                  : "Không xác định"
              }
              readOnly
              className="w-full rounded-lg border bg-slate-100 px-3 py-2 text-sm text-slate-600 cursor-not-allowed"
            />
          </div>
        )}

        {/* Nút lưu */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-slate-800"
          >
            <Save className="h-4 w-4" />{" "}
            {isEdit ? "Cập nhật phòng ban" : "Lưu thông tin"}
          </button>
        </div>
      </form>
    </div>
  );
}
