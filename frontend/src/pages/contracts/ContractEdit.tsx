import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// MOCK EMPLOYEES (dropdown)
const mockEmployees = [
  { id: 1, name: "Nguyễn Văn A" },
  { id: 2, name: "Trần Thị B" },
  { id: 3, name: "Phạm Văn C" },
];

// MOCK CONTRACTS
const mockContracts = [
  {
    id: 1,
    employee_id: 1,
    type: "HĐ Lao động 1 năm",
    start_date: "2023-01-01",
    end_date: "2024-01-01",
    note: "Gia hạn sau 1 năm",
    file_url: "contract1.pdf",
  },
  {
    id: 2,
    employee_id: 2,
    type: "HĐ Lao động không thời hạn",
    start_date: "2022-05-15",
    end_date: "2025-05-15",
    note: "",
    file_url: "contract2.pdf",
  },
];

const ContractEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    employee_id: "",
    type: "",
    start_date: "",
    end_date: "",
    note: "",
    file: null as File | null,
    file_url: "",
  });

  // Load contract data
  useEffect(() => {
    const contract = mockContracts.find((c) => c.id === Number(id));

    if (contract) {
      setForm({
        employee_id: String(contract.employee_id),
        type: contract.type,
        start_date: contract.start_date,
        end_date: contract.end_date,
        note: contract.note || "",
        file: null,
        file_url: contract.file_url,
      });
    }

    setLoading(false);
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, file: e.target.files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Updated Contract:", form);
    alert("Hợp đồng đã được cập nhật (mock). API chưa kết nối.");

    navigate("/contracts");
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Chỉnh sửa hợp đồng</h3>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm border-0">

        {/* EMPLOYEE */}
        <div className="mb-3">
          <label className="form-label fw-bold">Nhân viên</label>
          <select
            className="form-select"
            name="employee_id"
            value={form.employee_id}
            onChange={handleChange}
            required
          >
            {mockEmployees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </div>

        {/* TYPE */}
        <div className="mb-3">
          <label className="form-label fw-bold">Loại hợp đồng</label>
          <input
            type="text"
            className="form-control"
            name="type"
            value={form.type}
            onChange={handleChange}
            required
          />
        </div>

        {/* DATES */}
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label fw-bold">Ngày bắt đầu</label>
            <input
              type="date"
              className="form-control"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">Ngày kết thúc</label>
            <input
              type="date"
              className="form-control"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* FILE */}
        <div className="mt-3">
          <label className="form-label fw-bold">File hợp đồng</label>

          {form.file_url && !form.file && (
            <p className="text-muted mb-1">
              File hiện tại: <strong>{form.file_url}</strong>
            </p>
          )}

          <input type="file" className="form-control" onChange={handleFileChange} />

          {form.file && (
            <p className="mt-2 text-muted">Đã chọn: {form.file.name}</p>
          )}
        </div>

        {/* NOTE */}
        <div className="mt-3">
          <label className="form-label fw-bold">Ghi chú</label>
          <textarea
            className="form-control"
            rows={3}
            name="note"
            value={form.note}
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
            onClick={() => navigate("/contracts")}
          >
            Hủy
          </button>
        </div>

      </form>
    </div>
  );
};

export default ContractEdit;
