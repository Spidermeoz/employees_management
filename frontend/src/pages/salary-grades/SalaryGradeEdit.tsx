import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiGet, apiPut } from "../../api/client";

const SalaryGradeEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    grade_name: "",
    base_salary: "",
    coefficient: "",
  });

  // 🔥 Load dữ liệu thật từ backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiGet<any>(`/salary-grades/${id}`);

        setForm({
          grade_name: data.grade_name,
          base_salary: String(Number(data.base_salary)),
          coefficient: String(Number(data.coefficient)),
        });
      } catch (err) {
        console.error(err);
        setError("Không thể tải thông tin bậc lương.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const payload = {
        grade_name: form.grade_name,
        base_salary: Number(form.base_salary),
        coefficient: Number(form.coefficient),
      };

      await apiPut(`/salary-grades/${id}`, payload);

      alert("Cập nhật thành công!");
      navigate("/salary-grades");
    } catch (err) {
      console.error(err);
      setError("Không thể cập nhật bậc lương. Vui lòng thử lại.");
    }
  };

  if (loading) return <p className="m-3">Đang tải dữ liệu...</p>;

  if (error) return <div className="alert alert-danger m-3">{error}</div>;

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Chỉnh sửa bậc lương</h3>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm border-0">
        {/* GRADE NAME */}
        <div className="mb-3">
          <label className="form-label fw-bold">Tên bậc lương</label>
          <input
            type="text"
            className="form-control"
            name="grade_name"
            value={form.grade_name}
            onChange={handleChange}
            required
          />
        </div>

        {/* BASE SALARY */}
        <div className="mb-3">
          <label className="form-label fw-bold">Lương cơ bản (VNĐ)</label>
          <input
            type="number"
            className="form-control"
            name="base_salary"
            value={form.base_salary}
            onChange={handleChange}
            min={0}
            required
          />
        </div>

        {/* COEFFICIENT */}
        <div className="mb-3">
          <label className="form-label fw-bold">Hệ số</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            name="coefficient"
            value={form.coefficient}
            onChange={handleChange}
            min={0}
            required
          />
        </div>

        {/* BUTTONS */}
        <div className="mt-4 d-flex gap-3">
          <button type="submit" className="btn btn-primary px-4">
            Cập nhật
          </button>

          <button
            type="button"
            className="btn btn-secondary px-4"
            onClick={() => navigate("/salary-grades")}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default SalaryGradeEdit;
