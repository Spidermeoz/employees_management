import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Mock positions
const mockPositions = [
  {
    id: 1,
    name: "Nhân viên",
    level: 1,
    description: "Cấp độ nhân viên cơ bản",
  },
  {
    id: 2,
    name: "Trưởng nhóm",
    level: 2,
    description: "Quản lý nhóm nhỏ",
  },
  {
    id: 3,
    name: "Trưởng phòng",
    level: 3,
    description: "Quản lý toàn bộ phòng ban",
  },
];

const PositionEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    level: 1,
    description: "",
  });

  // Load data by ID
  useEffect(() => {
    const pos = mockPositions.find((p) => p.id === Number(id));

    if (pos) {
      setForm({
        name: pos.name,
        level: pos.level,
        description: pos.description,
      });
    }

    setLoading(false);
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Updated Position:", form);
    alert("Cập nhật chức vụ (mock). API chưa kết nối.");

    navigate("/positions");
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Chỉnh sửa chức vụ</h3>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm border-0">
        
        {/* Tên chức vụ */}
        <div className="mb-3">
          <label className="form-label fw-bold">Tên chức vụ</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Level */}
        <div className="mb-3">
          <label className="form-label fw-bold">Level</label>
          <input
            type="number"
            min={1}
            className="form-control"
            name="level"
            value={form.level}
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

        {/* Buttons */}
        <div className="mt-4 d-flex gap-3">
          <button type="submit" className="btn btn-primary px-4">
            Cập nhật
          </button>

          <button
            type="button"
            className="btn btn-secondary px-4"
            onClick={() => navigate("/positions")}
          >
            Hủy
          </button>
        </div>

      </form>
    </div>
  );
};

export default PositionEdit;
