import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Mock departments
const mockDepartments = [
  {
    id: 1,
    name: "Phòng Kế Toán",
    description: "Xử lý sổ sách và báo cáo tài chính",
    manager_id: 1,
    phone: "0901112222",
  },
  {
    id: 2,
    name: "Phòng Nhân Sự",
    description: "Quản lý nhân lực và tuyển dụng",
    manager_id: 2,
    phone: "0903334444",
  },
  {
    id: 3,
    name: "Phòng IT",
    description: "Phát triển phần mềm và quản lý hệ thống",
    manager_id: 3,
    phone: "0905556666",
  },
];

// Mock employees (for selecting manager)
const mockEmployees = [
  { id: 1, name: "Nguyễn Văn A" },
  { id: 2, name: "Trần Thị B" },
  { id: 3, name: "Phạm Văn C" },
];

const DepartmentEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    description: "",
    phone: "",
    manager_id: "",
  });

  // Load department data
  useEffect(() => {
    const dept = mockDepartments.find((d) => d.id === Number(id));

    if (dept) {
      setForm({
        name: dept.name,
        description: dept.description,
        phone: dept.phone,
        manager_id: dept.manager_id.toString(),
      });
    }
    setLoading(false);
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Updated department:", form);
    alert("Cập nhật phòng ban (mock). API chưa kết nối!");

    navigate("/departments");
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

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
            {mockEmployees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
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
