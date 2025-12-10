import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiGet, apiDelete } from "../../api/client"; // 🔥 Thêm apiDelete
import {
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaUser,
  FaCalendarAlt,
  FaCalendarDay,
  FaInbox,
} from "react-icons/fa";

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

const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

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
  const [monthFilter, setMonthFilter] = useState(getCurrentMonth());
  const [dateFilter, setDateFilter] = useState(getToday());
  const [filterByDay, setFilterByDay] = useState(false); // State cho checkbox

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔥 Tách logic fetch dữ liệu ra một hàm riêng để có thể gọi lại
  const fetchData = async () => {
    try {
      setLoading(true);
      const [empData, tsData] = await Promise.all([
        apiGet<Employee[]>("/employees"),
        apiGet<Timesheet[]>("/timesheets"),
      ]);

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

  useEffect(() => {
    fetchData();
  }, []);

  const getEmployeeName = (id: number) => {
    const emp = employees.find((e) => e.id === id);
    return emp ? emp.full_name : "Không xác định";
  };

  // 🔥 Hàm xử lý xóa chấm công
  const handleDelete = async (
    id: number,
    date: string,
    employeeName: string
  ) => {
    const confirmDelete = window.confirm(
      `Bạn có chắc chắn muốn xóa chấm công của "${employeeName}" vào ngày "${date}"?`
    );
    if (!confirmDelete) {
      return;
    }

    try {
      await apiDelete(`/timesheets/${id}`);
      alert("Xóa chấm công thành công!");
      fetchData(); // Tải lại danh sách
    } catch (err) {
      console.error(err);
      alert("Lỗi! Không thể xóa chấm công.");
    }
  };

  // 🔍 FILTER DATA với logic mới
  const filtered = timesheets.filter((t) => {
    const matchEmployee = employeeFilter
      ? t.employee_id === Number(employeeFilter)
      : true;

    // Logic lọc ngày/tháng linh hoạt
    let dateMatch = true;
    if (filterByDay) {
      dateMatch = dateFilter ? t.date === dateFilter : true;
    } else {
      dateMatch = monthFilter ? t.date.startsWith(monthFilter) : true;
    }

    return matchEmployee && dateMatch;
  });

  if (loading) return <p className="m-3 text-center">Đang tải dữ liệu...</p>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h3 className="fw-bold mb-0">Danh sách chấm công</h3>
        </div>
        <div className="card-body">
          {/* FILTERS */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="row g-3 align-items-end">
                {/* EMPLOYEE FILTER */}
                <div className="col-md-3">
                  <label className="form-label fw-bold">
                    <FaUser className="me-1" /> Nhân viên
                  </label>
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
                  <label className="form-label fw-bold">
                    <FaCalendarAlt className="me-1" /> Tháng
                  </label>
                  <input
                    type="month"
                    className="form-control"
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(e.target.value)}
                    disabled={filterByDay} // Vô hiệu hóa khi lọc theo ngày
                  />
                </div>

                {/* DAY FILTER + CHECKBOX */}
                <div className="col-md-4">
                  <label className="form-label fw-bold">
                    <FaCalendarDay className="me-1" /> Ngày cụ thể
                  </label>
                  <div className="input-group">
                    <div className="input-group-text">
                      <input
                        className="form-check-input mt-0"
                        type="checkbox"
                        checked={filterByDay}
                        onChange={(e) => setFilterByDay(e.target.checked)}
                        aria-label="Checkbox for filtering by specific day"
                      />
                    </div>
                    <input
                      type="date"
                      className="form-control"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      disabled={!filterByDay} // Vô hiệu hóa nếu checkbox chưa tích
                    />
                  </div>
                </div>

                {/* ADD BUTTON */}
                <div className="col-md-2 text-md-end">
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => navigate("/timesheets/create")}
                  >
                    <FaPlus className="me-1" /> Thêm
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Nhân viên</th>
                  <th>Ngày</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Số giờ</th>
                  <th style={{ width: "180px" }}>Hành động</th>
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
                          className="btn btn-sm btn-info text-white me-1"
                          onClick={() => navigate(`/timesheets/${t.id}`)}
                          title="Xem chi tiết"
                        >
                          <FaEye />
                        </button>
                        <button
                          className="btn btn-sm btn-warning me-1"
                          onClick={() => navigate(`/timesheets/${t.id}/edit`)}
                          title="Chỉnh sửa"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() =>
                            handleDelete(
                              t.id,
                              t.date,
                              getEmployeeName(t.employee_id)
                            )
                          }
                          title="Xóa"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-muted">
                      <FaInbox className="me-2" />
                      Không có dữ liệu chấm công phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimesheetsList;
