import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// MOCK EMPLOYEES
const mockEmployees = [
  { id: 1, name: "Nguyễn Văn A" },
  { id: 2, name: "Trần Thị B" },
  { id: 3, name: "Phạm Văn C" },
];

// MOCK TIMESHEETS
const mockTimesheets = [
  {
    id: 1,
    employee_id: 1,
    date: "2025-02-01",
    check_in: "08:00",
    check_out: "17:00",
    hours: 8,
  },
  {
    id: 2,
    employee_id: 1,
    date: "2025-02-02",
    check_in: "08:30",
    check_out: "17:15",
    hours: 7.5,
  },
  {
    id: 3,
    employee_id: 2,
    date: "2025-02-01",
    check_in: "09:00",
    check_out: "18:00",
    hours: 8,
  },
];

const TimesheetsList: React.FC = () => {
  const navigate = useNavigate();

  const [employeeFilter, setEmployeeFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("2025-02");

  // FILTER LOGIC
  const filtered = mockTimesheets.filter((t) => {
    const matchEmployee = employeeFilter
      ? t.employee_id === Number(employeeFilter)
      : true;

    const matchMonth = t.date.startsWith(monthFilter);

    return matchEmployee && matchMonth;
  });

  const getEmployeeName = (id: number) => {
    const emp = mockEmployees.find((e) => e.id === id);
    return emp ? emp.name : "Không xác định";
  };

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Chấm công</h3>

      {/* FILTERS */}
      <div className="card p-3 shadow-sm border-0 mb-4">
        <div className="row g-3 align-items-center">

          {/* EMPLOYEE FILTER */}
          <div className="col-md-4">
            <label className="form-label fw-bold">Nhân viên</label>
            <select
              className="form-select"
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
            >
              <option value="">-- Tất cả --</option>
              {mockEmployees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          {/* MONTH FILTER */}
          <div className="col-md-4">
            <label className="form-label fw-bold">Tháng</label>
            <input
              type="month"
              className="form-control"
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
            />
          </div>

          {/* ADD BUTTON */}
          <div className="col-md-4 d-flex align-items-end justify-content-end">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/timesheets/create")}
            >
              ➕ Thêm chấm công
            </button>
          </div>

        </div>
      </div>

      {/* TABLE */}
      <div className="card shadow-sm border-0 p-3">
        <table className="table table-striped">
          <thead className="table-light">
            <tr>
              <th>Nhân viên</th>
              <th>Ngày</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Số giờ</th>
              <th style={{ width: "150px" }}>Hành động</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length > 0 ? (
              filtered.map((t) => (
                <tr key={t.id}>
                  <td>{getEmployeeName(t.employee_id)}</td>
                  <td>{t.date}</td>
                  <td>{t.check_in}</td>
                  <td>{t.check_out}</td>
                  <td>{t.hours}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-info me-2"
                      onClick={() => navigate(`/timesheets/${t.id}`)}
                    >
                      👁 Xem
                    </button>

                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() =>
                        navigate(`/timesheets/${t.id}/edit`)
                      }
                    >
                      ✏ Sửa
                    </button>

                    <button className="btn btn-sm btn-danger">
                      🗑 Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-3 text-muted">
                  Không có dữ liệu chấm công.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default TimesheetsList;
