import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const mockEmployees = [
  { id: 1, name: "Nguyễn Văn A" },
  { id: 2, name: "Trần Thị B" },
];

const PayrollCreate: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    employee_id: "",
    month: "",
    year: "2025",
    base_salary: "",
    allowance: "",
    bonus: "",
    penalty: "",
  });

  const change = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e: any) => {
    e.preventDefault();
    console.log("Payroll create:", form);
    alert("Tạo bảng lương (mock)");
    navigate("/payrolls");
  };

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Tạo bảng lương</h3>

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
              <option value="">-- Chọn nhân viên --</option>
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
              name="base_salary"
              className="form-control"
              value={form.base_salary}
              onChange={change}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Phụ cấp</label>
            <input
              type="number"
              name="allowance"
              className="form-control"
              value={form.allowance}
              onChange={change}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Thưởng</label>
            <input
              type="number"
              name="bonus"
              className="form-control"
              value={form.bonus}
              onChange={change}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Phạt</label>
            <input
              type="number"
              name="penalty"
              className="form-control"
              value={form.penalty}
              onChange={change}
            />
          </div>
        </div>

        <div className="mt-4 d-flex gap-3">
          <button className="btn btn-primary px-4">Lưu</button>

          <button
            className="btn btn-secondary px-4"
            onClick={() => navigate("/payrolls")}
            type="button"
          >
            Huỷ
          </button>
        </div>
      </form>
    </div>
  );
};

export default PayrollCreate;
