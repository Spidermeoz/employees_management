import React, { useState } from "react";
import { useNavigate, } from "react-router-dom";

const mockEmployees = [
  { id: 1, name: "Nguyễn Văn A" },
  { id: 2, name: "Trần Thị B" },
];

const mockReward = {
  id: 1,
  employee_id: 1,
  type: "reward",
  title: "Thưởng Tết",
  amount: 2000000,
  date: "2024-12-28",
  note: "Ghi chú cũ",
};

const RewardEdit: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ ...mockReward });

  const change = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e: any) => {
    e.preventDefault();
    console.log("Update:", form);
    alert("Cập nhật (mock).");
    navigate("/rewards");
  };

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Chỉnh sửa thưởng/kỷ luật</h3>

      <form className="card p-4 shadow-sm border-0" onSubmit={submit}>
        <div className="row g-3">

          <div className="col-md-6">
            <label className="form-label">Nhân viên</label>
            <select
              className="form-select"
              name="employee_id"
              value={form.employee_id}
              onChange={change}
            >
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
              onChange={change}
            >
              <option value="reward">Thưởng</option>
              <option value="discipline">Kỷ luật</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Tiêu đề</label>
            <input
              name="title"
              className="form-control"
              value={form.title}
              onChange={change}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Số tiền</label>
            <input
              type="number"
              name="amount"
              className="form-control"
              value={form.amount}
              onChange={change}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Ngày</label>
            <input
              type="date"
              name="date"
              className="form-control"
              value={form.date}
              onChange={change}
            />
          </div>

          <div className="col-12">
            <label className="form-label">Ghi chú</label>
            <textarea
              name="note"
              className="form-control"
              rows={3}
              value={form.note}
              onChange={change}
            ></textarea>
          </div>
        </div>

        <div className="mt-4 d-flex gap-3">
          <button className="btn btn-primary px-4">Cập nhật</button>
          <button className="btn btn-secondary px-4" onClick={() => navigate("/rewards")}>
            Huỷ
          </button>
        </div>
      </form>
    </div>
  );
};

export default RewardEdit;
