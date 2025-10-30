import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import employeesData from "../../mock/employees.json";
import departmentsData from "../../mock/departments.json";

interface Employee {
  id: number;
  code: string;
  full_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth?: string;
  position: string;
  address?: string;
  status: string;
  hired_at?: string;
  avatar_url?: string;
  department_id?: number;
  department_name?: string;
  created_by_id?: number;
  updated_by_id?: number;
}

export default function EmployeeForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<Employee>({
    id: Date.now(),
    code: "",
    full_name: "",
    email: "",
    phone: "",
    gender: "other",
    date_of_birth: "",
    position: "",
    address: "",
    status: "active",
    hired_at: "",
    avatar_url: "",
    department_id: undefined,
    department_name: "",
  });

  useEffect(() => {
    if (isEdit) {
      const found = (employeesData as Employee[]).find(
        (e) => e.id === Number(id)
      );
      if (found) setFormData(found);
    }
  }, [id, isEdit]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.code.trim() ||
      !formData.full_name.trim() ||
      !formData.email.trim()
    ) {
      alert("Vui lòng nhập đủ Mã NV, Họ tên và Email.");
      return;
    }

    console.log(isEdit ? "Cập nhật:" : "Thêm mới:", formData);
    alert(
      isEdit ? "Cập nhật nhân viên thành công!" : "Thêm nhân viên thành công!"
    );
    navigate("/app/employees");
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
          {isEdit ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}
        </h1>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Mã nhân viên */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Mã nhân viên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="VD: EMP001"
            />
          </div>

          {/* Họ tên */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="Nguyễn Văn A"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="a.nguyen@example.com"
            />
          </div>

          {/* Số điện thoại */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Số điện thoại
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="090xxxxxxx"
            />
          </div>

          {/* Giới tính */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Giới tính
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
            >
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>

          {/* Ngày sinh */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Ngày sinh
            </label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth || ""}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>

          {/* Địa chỉ */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Địa chỉ
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={2}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300 resize-none"
              placeholder="Số nhà, đường, quận/huyện, tỉnh/thành..."
            />
          </div>

          {/* Chức vụ */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Chức vụ
            </label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="Nhân viên, Trưởng phòng..."
            />
          </div>

          {/* Phòng ban */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Phòng ban <span className="text-red-500">*</span>
            </label>
            <select
              name="department_id"
              value={formData.department_id || ""}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
            >
              <option value="">-- Chọn phòng ban --</option>
              {(departmentsData as any[]).map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Trạng thái */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Trạng thái
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
            >
              <option value="active">Đang làm việc</option>
              <option value="inactive">Tạm nghỉ việc</option>
            </select>
          </div>

          {/* Ngày vào công ty */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Ngày vào công ty
            </label>
            <input
              type="date"
              name="hired_at"
              value={formData.hired_at || ""}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>

          {/* Ảnh đại diện */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Ảnh đại diện (URL)
            </label>
            <input
              type="text"
              name="avatar_url"
              value={formData.avatar_url}
              onChange={handleChange}
              placeholder="https://example.com/avatar.jpg"
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>
        </div>

        {/* Nút lưu */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-slate-800"
          >
            <Save className="h-4 w-4" /> Lưu thông tin
          </button>
        </div>
      </form>
    </div>
  );
}
