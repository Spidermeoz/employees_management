import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiGet, apiPost } from "../../api/client";

type EmployeeOption = {
  id: number;
  full_name: string;
};

const DepartmentCreate: React.FC = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [loadingEmp, setLoadingEmp] = useState(true);
  const [errorEmp, setErrorEmp] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    phone: "",
    manager_id: "",
  });

  // 🔥 1) Load danh sách nhân viên
  useEffect(() => {
    apiGet<EmployeeOption[]>("/employees")
      .then((data) => setEmployees(data))
      .catch((err) => {
        console.error("Lỗi khi load danh sách nhân viên:", err);
        setErrorEmp("Không thể tải danh sách nhân viên.");
      })
      .finally(() => setLoadingEmp(false));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 2) Submit form để tạo phòng ban thật
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await apiPost("/departments", {
        name: form.name,
        description: form.description,
        phone: form.phone,
        manager_id: form.manager_id ? Number(form.manager_id) : null,
      });

      alert("Tạo phòng ban thành công!");
      navigate("/departments");
    } catch (err: any) {
      console.error(err);
      alert("Lỗi tạo phòng ban: " + err.message);
    }
  };

  if (loadingEmp) return <p className="m-3">Đang tải danh sách nhân viên...</p>;

  if (errorEmp) return <div className="alert alert-danger m-3">{errorEmp}</div>;

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Thêm phòng ban</h3>

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
            name="description"
            rows={3}
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
            Lưu
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

export default DepartmentCreate;
