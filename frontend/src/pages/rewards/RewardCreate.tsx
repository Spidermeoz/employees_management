import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const mockEmployees = [
  { id: 1, name: "Nguyễn Văn A" },
  { id: 2, name: "Trần Thị B" },
];

const RewardCreate: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    employee_id: "",
    type: "reward",
    title: "",
    amount: "",
    date: "",
    note: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = (e: any) => {
    e.preventDefault();

    console.log("Create reward:", form);
    alert("Tạo thưởng/phạt (mock).");
    navigate("/rewards");
  };

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Thêm thưởng/kỷ luật</h3>

      <form className="card p-4 shadow-sm border-0" onSubmit={submit}>
        <div className="row g-3">

          <div className="col-md-6">
            <label className="form-label">Nhân viên</label>
            <select
              className="form-select"
              name="employee_id"
              value={form.employee_id}
              onChange={handleChange}
            >
              <option value="">-- Chọn nhân viên --</option>
              {mockEmployees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Loại</label>
            <select
              className="form-select"
              name="type"
              value={form.type}
              onChange={handleChange}
            >
              <option value="reward">Thưởng</option>
              <option value="discipline">Kỷ luật</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Tiêu đề</label>
            <input
              type="text"
              className="form-control"
              name="title"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Số tiền</label>
            <input
              type="number"
              className="form-control"
              name="amount"
              value={form.amount}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Ngày</label>
            <input
              type="date"
              className="form-control"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
          </div>

          <div className="col-12">
            <label className="form-label">Ghi chú</label>
            <textarea
              name="note"
              className="form-control"
              rows={3}
              value={form.note}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>

        <div className="mt-4 d-flex gap-3">
          <button className="btn btn-primary px-4">Lưu</button>
          <button
            className="btn btn-secondary px-4"
            type="button"
            onClick={() => navigate("/rewards")}
          >
            Huỷ
          </button>
        </div>
      </form>
    </div>
  );
};

export default RewardCreate;
