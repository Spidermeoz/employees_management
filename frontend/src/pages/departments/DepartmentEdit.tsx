import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import { apiGet, apiPut } from "../../api/client";

type Employee = {
  id: number;
  full_name: string;
};

type Department = {
  id: number;
  name: string;
  description?: string | null;
  phone?: string | null;
  manager_id?: number | null;
};

const DepartmentEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    phone: "",
    manager_id: "",
  });

  // 🔥 Load dữ liệu phòng ban + danh sách nhân viên
  useEffect(() => {
    const loadData = async () => {
      try {
        if (!id) return;

        // 1️⃣ Load phòng ban
        const dept = await apiGet<Department>(`/departments/${id}`);
        setForm({
          name: dept.name,
          description: dept.description || "",
          phone: dept.phone || "",
          manager_id: dept.manager_id ? dept.manager_id.toString() : "",
        });

        // 2️⃣ Load danh sách nhân viên
        const emps = await apiGet<Employee[]>("/employees");
        setEmployees(emps);
      } catch (err) {
        console.error(err);
        setError("Không thể tải dữ liệu phòng ban.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 Gửi lên backend để cập nhật phòng ban
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await apiPut(`/departments/${id}`, {
        name: form.name,
        description: form.description,
        phone: form.phone,
        manager_id: form.manager_id ? Number(form.manager_id) : null,
      });

      alert("Cập nhật phòng ban thành công!");
      navigate("/departments");
    } catch (err: any) {
      console.error(err);
      alert("Lỗi cập nhật phòng ban: " + err.message);
    }
  };

  if (loading) return <p className="m-3">Đang tải dữ liệu...</p>;

  if (error)
    return (
      <div className="alert alert-danger m-3">
        {error}
      </div>
    );

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Chỉnh sửa phòng ban</h3>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm border-0">

        {/* Tên phòng ban */}
        <div className="mb-3">
          <label className="form-label fw-bold">Tên phòng ban</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Mô tả */}
        <div className="mb-3">
          <label className="form-label fw-bold">Mô tả</label>
          <textarea
            className="form-control"
            rows={3}
            name="description"
            value={form.description}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Số điện thoại */}
        <div className="mb-3">
          <label className="form-label fw-bold">Số điện thoại</label>
          <input
            type="text"
            className="form-control"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        {/* Trưởng phòng */}
        <div className="mb-3">
          <label className="form-label fw-bold">Trưởng phòng</label>
          <select
            name="manager_id"
            className="form-select"
            value={form.manager_id}
            onChange={handleChange}
          >
            <option value="">-- Chọn trưởng phòng --</option>

            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.full_name}
              </option>
            ))}
          </select>
        </div>

        {/* BUTTONS */}
        <div className="mt-4 d-flex gap-3">
          <button type="submit" className="btn btn-primary px-4">
            Cập nhật
          </button>

          <button
            type="button"
            className="btn btn-secondary px-4"
            onClick={() => navigate("/departments")}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default DepartmentEdit;
