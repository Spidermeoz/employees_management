import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Mock employees
const mockEmployees = [
  { id: 1, name: "Nguyễn Văn A" },
  { id: 2, name: "Trần Thị B" },
  { id: 3, name: "Phạm Văn C" },
];

// Mock timesheets
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

const TimesheetDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [timesheet, setTimesheet] = useState<any>(null);
  const [employeeName, setEmployeeName] = useState("");

  useEffect(() => {
    const ts = mockTimesheets.find((t) => t.id === Number(id));

    if (ts) {
      setTimesheet(ts);

      const emp = mockEmployees.find((e) => e.id === ts.employee_id);
      setEmployeeName(emp ? emp.name : "Không xác định");
    }
  }, [id]);

  if (!timesheet) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Chi tiết chấm công</h3>

      <div className="card p-4 shadow-sm border-0 mb-4">
        <h4 className="fw-bold">
          Chấm công ngày {timesheet.date} – {employeeName}
        </h4>

        <p><strong>Ngày:</strong> {timesheet.date}</p>
        <p><strong>Giờ check-in:</strong> {timesheet.check_in}</p>
        <p><strong>Giờ check-out:</strong> {timesheet.check_out}</p>
        <p><strong>Số giờ làm:</strong> {timesheet.hours} giờ</p>

        {/* Optional: status check */}
        <p>
          <strong>Trạng thái:</strong>{" "}
          {timesheet.check_in > "08:15" ? (
            <span className="badge bg-danger">Đi trễ</span>
          ) : (
            <span className="badge bg-success">Đúng giờ</span>
          )}
        </p>

        {/* ACTIONS */}
        <div className="mt-3 d-flex gap-3">
          <button
            className="btn btn-warning"
            onClick={() => navigate(`/timesheets/${timesheet.id}/edit`)}
          >
            ✏ Sửa
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => navigate("/timesheets")}
          >
            ↩ Quay lại
          </button>
        </div>

      </div>
    </div>
  );
};

export default TimesheetDetail;
