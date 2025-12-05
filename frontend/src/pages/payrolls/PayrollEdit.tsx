import React, { useState } from "react";
import { useNavigate, } from "react-router-dom";

const mockEmployees = [
  { id: 1, name: "Nguyễn Văn A" },
  { id: 2, name: "Trần Thị B" },
];

const mockPayroll = {
  id: 1,
  employee_id: 1,
  month: 1,
  year: 2025,
  base_salary: 8000000,
  allowance: 1500000,
  bonus: 2000000,
  penalty: 200000,
};

const PayrollEdit: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ ...mockPayroll });

  const change = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e: any) => {
    e.preventDefault();
    console.log("Update payroll:", form);
    alert("Cập nhật bảng lương (mock).");
    navigate("/payrolls");
  };

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Chỉnh sửa bảng lương</h3>

      <form className="card p-4 shadow-sm border-0" onSubmit={submit}>
        <div className="row g-3">

          <div className="col-md-6">
            <label className="form-label">Nhân viên</label>
            <select
              name="employee_id"
              className="form-select"
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

          <div className="col-md-3">
            <label className="form-label">Tháng</label>
            <input
              type="number"
              name="month"
              className="form-control"
              value={form.month}
              onChange={change}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Năm</label>
            <input
              type="number"
              name="year"
              className="form-control"
              value={form.year}
              onChange={change}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Lương cơ bản</label>
            <input
              type="number"
              className="form-control"
              name="base_salary"
              value={form.base_salary}
              onChange={change}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Phụ cấp</label>
            <input
              type="number"
              className="form-control"
              name="allowance"
              value={form.allowance}
              onChange={change}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Thưởng</label>
            <input
              type="number"
              className="form-control"
              name="bonus"
              value={form.bonus}
              onChange={change}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Phạt</label>
            <input
              type="number"
              className="form-control"
              name="penalty"
              value={form.penalty}
              onChange={change}
            />
          </div>
        </div>

        <div className="mt-4 d-flex gap-3">
          <button className="btn btn-primary px-4">Cập nhật</button>

          <button
            className="btn btn-secondary px-4"
            type="button"
            onClick={() => navigate("/payrolls")}
          >
            Huỷ
          </button>
        </div>
      </form>
    </div>
  );
};

export default PayrollEdit;
