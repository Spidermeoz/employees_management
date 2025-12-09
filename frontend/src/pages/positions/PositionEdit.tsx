import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiGet, apiPut } from "../../api/client";

interface Position {
  name: string;
  level: number;
  description?: string | null;
}

const PositionEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Position>({
    name: "",
    level: 1,
    description: "",
  });
  const [error, setError] = useState<string | null>(null);

  // 🔥 Load data thật từ API
  useEffect(() => {
    const loadPosition = async () => {
      try {
        const data = await apiGet<Position>(`/positions/${id}`);
        setForm({
          name: data.name,
          level: data.level,
          description: data.description || "",
        });
      } catch (err) {
        console.error(err);
        setError("Không thể tải dữ liệu chức vụ.");
      } finally {
        setLoading(false);
      }
    };

    loadPosition();
  }, [id]);

  // Xử lý change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: name === "level" ? Number(value) : value,
    });
  };

  // 🔥 Submit API PUT /positions/:id
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await apiPut(`/positions/${id}`, {
        name: form.name,
        level: form.level,
        description: form.description || null,
      });

      navigate("/positions");
    } catch (err) {
      console.error(err);
      setError("Không thể cập nhật chức vụ. Vui lòng thử lại.");
    }
  };

  if (loading) return <p className="m-3">Đang tải dữ liệu...</p>;

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Chỉnh sửa chức vụ</h3>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm border-0">
        {error && <div className="alert alert-danger py-2">{error}</div>}

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
            value={form.description || ""}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* BUTTONS */}
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
