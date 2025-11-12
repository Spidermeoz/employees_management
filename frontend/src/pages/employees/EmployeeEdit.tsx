import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import employeesData from "../../mock/employees.json";
import departmentsData from "../../mock/departments.json";
import positionsData from "../../mock/positions.json";
import educationsData from "../../mock/educations.json";

interface Employee {
  id: number;
  code: string;
  full_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth?: string;
  address?: string;
  status: string;
  hired_at?: string;
  avatar_url?: string;
  department_id?: number;
  position_id?: number;
  education_id?: number;
}

export default function EmployeeEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const found = (employeesData as Employee[]).find(
      (e) => e.id === Number(id)
    );
    if (found) setEmployee(found);
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setEmployee((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee) return;

    if (!employee.full_name.trim() || !employee.email.trim()) {
      alert("Vui lòng nhập đầy đủ Họ tên và Email.");
      return;
    }

    console.log("Cập nhật nhân viên:", employee);
    alert("Cập nhật nhân viên thành công!");
    navigate("/app/employees");
  };

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-500">
        <p>Không tìm thấy nhân viên.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-3 rounded-lg border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          ← Quay lại
        </button>
      </div>
    );
  }

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
          Chỉnh sửa nhân viên
        </h1>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Mã NV */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Mã nhân viên
            </label>
            <input
              type="text"
              name="code"
              value={employee.code}
              onChange={handleChange}
              readOnly
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
              value={employee.full_name}
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
              value={employee.email}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
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
              value={employee.phone}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>

          {/* Giới tính */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Giới tính
            </label>
            <select
              name="gender"
              value={employee.gender}
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
              value={employee.date_of_birth || ""}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>

          {/* Phòng ban */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Phòng ban
            </label>
            <select
              name="department_id"
              value={employee.department_id || ""}
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

          {/* Chức vụ */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Chức vụ
            </label>
            <select
              name="position_id"
              value={employee.position_id || ""}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
            >
              <option value="">-- Chọn chức vụ --</option>
              {(positionsData as any[]).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Trình độ học vấn */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Trình độ học vấn
            </label>
            <select
              name="education_id"
              value={employee.education_id || ""}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
            >
              <option value="">-- Chọn trình độ --</option>
              {(educationsData as any[]).map((e) => (
                <option key={e.id} value={e.id}>
                  {e.level} - {e.major}
                </option>
              ))}
            </select>
          </div>

          {/* Địa chỉ */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Địa chỉ
            </label>
            <textarea
              name="address"
              value={employee.address}
              onChange={handleChange}
              rows={2}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300 resize-none"
            />
          </div>

          {/* Trạng thái */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Trạng thái
            </label>
            <select
              name="status"
              value={employee.status}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
            >
              <option value="active">Đang hoạt động</option>
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
              value={employee.hired_at || ""}
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
              value={employee.avatar_url}
              onChange={handleChange}
              placeholder="https://example.com/avatar.jpg"
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-slate-800"
          >
            <Save className="h-4 w-4" /> Cập nhật nhân viên
          </button>
        </div>
      </form>
    </div>
  );
}
