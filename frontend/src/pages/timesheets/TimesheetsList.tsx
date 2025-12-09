import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../../api/client";

type Employee = {
  id: number;
  full_name: string;
};

type Timesheet = {
  id: number;
  employee_id: number;
  date: string;
  check_in?: string | null;
  check_out?: string | null;
  working_hours?: number | string | null;
};

// 📌 Lấy tháng hiện tại dạng YYYY-MM
const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

// 📌 Lấy ngày hiện tại dạng YYYY-MM-DD
const getToday = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(now.getDate()).padStart(2, "0")}`;
};

const TimesheetsList: React.FC = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);

  const [employeeFilter, setEmployeeFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState(getCurrentMonth()); // mặc định tháng này
  const [dateFilter, setDateFilter] = useState(getToday()); // mặc định hôm nay

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔥 Load employees + timesheets từ backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empData, tsData] = await Promise.all([
          apiGet<Employee[]>("/employees"),
          apiGet<Timesheet[]>("/timesheets"),
        ]);

        // Convert Decimal → number
        const cleaned = tsData.map((t) => ({
          ...t,
          working_hours:
            t.working_hours === null || t.working_hours === undefined
              ? null
              : Number(t.working_hours),
        }));

        setEmployees(empData);
        setTimesheets(cleaned);
      } catch (err) {
        console.error("FETCH ERROR:", err);
        setError("Không thể tải dữ liệu chấm công.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="m-3">Đang tải dữ liệu...</p>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;

  // Lấy tên nhân viên theo ID
  const getEmployeeName = (id: number) => {
    const emp = employees.find((e) => e.id === id);
    return emp ? emp.full_name : "Không xác định";
  };

  // 🔍 FILTER DATA
  const filtered = timesheets.filter((t) => {
    const matchEmployee = employeeFilter
      ? t.employee_id === Number(employeeFilter)
      : true;

    const matchMonth = monthFilter ? t.date.startsWith(monthFilter) : true;

    const matchDate = dateFilter ? t.date === dateFilter : true;

    // Nếu có chọn date → ưu tiên lọc theo ngày
    const finalMatch =
      (dateFilter ? matchDate : true) &&
      (monthFilter ? matchMonth : true) &&
      matchEmployee;

    return finalMatch;
  });

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Chấm công</h3>

      {/* FILTERS */}
      <div className="card p-3 shadow-sm border-0 mb-4">
        <div className="row g-3 align-items-center">
          {/* EMPLOYEE FILTER */}
          <div className="col-md-3">
            <label className="form-label fw-bold">Nhân viên</label>
            <select
              className="form-select"
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
            >
              <option value="">-- Tất cả --</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.full_name}
                </option>
              ))}
            </select>
          </div>

          {/* MONTH FILTER */}
          <div className="col-md-3">
            <label className="form-label fw-bold">Tháng</label>
            <input
              type="month"
              className="form-control"
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
            />
          </div>

          {/* DAY FILTER */}
          <div className="col-md-3">
            <label className="form-label fw-bold">Ngày</label>
            <input
              type="date"
              className="form-control"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>

          {/* ADD BUTTON */}
          <div className="col-md-3 d-flex align-items-end justify-content-end">
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
                  <td>{t.check_in || "—"}</td>
                  <td>{t.check_out || "—"}</td>
                  <td>{t.working_hours ?? "—"}</td>

                  <td>
                    <button
                      className="btn btn-sm btn-info me-2"
                      onClick={() => navigate(`/timesheets/${t.id}`)}
                    >
                      👁 Xem
                    </button>

                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => navigate(`/timesheets/${t.id}/edit`)}
                    >
                      ✏ Sửa
                    </button>

                    <button className="btn btn-sm btn-danger">🗑 Xóa</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-3 text-muted">
                  Không có dữ liệu chấm công phù hợp.
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
