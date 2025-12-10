import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiGet, apiDelete } from "../../api/client";
import {
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaUser,
  FaCalendarAlt,
  FaInbox,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";

// Kiểu dữ liệu theo PayrollResponse
type Payroll = {
  id: number;
  employee_id: number;
  month: number;
  year: number;
  base_salary: number;
  allowance: number;
  bonus: number;
  penalty: number;
  total_salary: number;
  employee?: {
    full_name: string;
  };
};

type SortField =
  | "base_salary"
  | "allowance"
  | "bonus"
  | "penalty"
  | "total_salary"
  | null;
type SortDirection = "asc" | "desc";

const getCurrentMonth = () => {
  const now = new Date();
  // Mặc định là tháng hiện tại - 1
  const lastMonth = now.getMonth() === 0 ? 12 : now.getMonth();
  const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
  return `${year}-${String(lastMonth).padStart(2, "0")}`;
};

const PayrollList: React.FC = () => {
  const navigate = useNavigate();

  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [employees, setEmployees] = useState<
    { id: number; full_name: string }[]
  >([]);
  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState(getCurrentMonth());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sorting state
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Load bảng lương và danh sách nhân viên
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [payrollData, employeeData] = await Promise.all([
          apiGet<Payroll[]>("/payrolls"),
          apiGet<{ id: number; full_name: string }[]>("/employees"),
        ]);

        setPayrolls(payrollData);
        setEmployees(employeeData);
      } catch (err) {
        console.error(err);
        setError("Không thể tải bảng lương.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new field and default to asc
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Get sort icon
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <FaSort className="text-muted" />;
    return sortDirection === "asc" ? (
      <FaSortUp className="text-primary" />
    ) : (
      <FaSortDown className="text-primary" />
    );
  };

  // Get employee name
  const getEmployeeName = (id: number) => {
    const emp = employees.find((e) => e.id === id);
    return emp ? emp.full_name : "Không xác định";
  };

  // Handle delete
  const handleDelete = async (
    id: number,
    employeeName: string,
    month: number,
    year: number
  ) => {
    const confirmDelete = window.confirm(
      `Bạn có chắc chắn muốn xóa bảng lương của "${employeeName}" tháng ${month}/${year}?`
    );
    if (!confirmDelete) return;

    try {
      await apiDelete(`/payrolls/${id}`);
      alert("Xóa bảng lương thành công!");
      // Tải lại danh sách
      const [payrollData] = await Promise.all([apiGet<Payroll[]>("/payrolls")]);
      setPayrolls(payrollData);
    } catch (err) {
      console.error(err);
      alert("Lỗi! Không thể xóa bảng lương.");
    }
  };

  // Apply filters and sorting
  const filteredAndSorted = useMemo(() => {
    // Filter by name
    let filtered = payrolls.filter((p) => {
      const name = p.employee?.full_name || getEmployeeName(p.employee_id);
      return name.toLowerCase().includes(search.toLowerCase());
    });

    // Filter by month and year
    if (monthFilter) {
      const [year, month] = monthFilter.split("-").map(Number);
      filtered = filtered.filter((p) => {
        return p.month === month && p.year === year;
      });
    }

    // Apply sorting
    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortField] as number;
        const bValue = b[sortField] as number;

        if (sortDirection === "asc") {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      });
    }

    return filtered;
  }, [payrolls, search, monthFilter, sortField, sortDirection, employees]);

  if (loading) return <p className="m-3 text-center">Đang tải dữ liệu...</p>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h3 className="fw-bold mb-0">Bảng lương</h3>
        </div>
        <div className="card-body">
          {/* FILTERS */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="row g-3 align-items-end">
                {/* EMPLOYEE FILTER */}
                <div className="col-md-4">
                  <label className="form-label fw-bold">
                    <FaUser className="me-1" /> Tên nhân viên
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm theo tên nhân viên..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                {/* MONTH FILTER */}
                <div className="col-md-4">
                  <label className="form-label fw-bold">
                    <FaCalendarAlt className="me-1" /> Tháng/Năm
                  </label>
                  <input
                    type="month"
                    className="form-control"
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(e.target.value)}
                  />
                </div>

                {/* ADD BUTTON */}
                <div className="col-md-4 text-md-end">
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate("/payrolls/create")}
                  >
                    <FaPlus className="me-1" /> Tạo bảng lương
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
                  <th>Tháng/Năm</th>
                  <th
                    className="cursor-pointer"
                    onClick={() => handleSort("base_salary")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Lương cơ bản</span>
                      {getSortIcon("base_salary")}
                    </div>
                  </th>
                  <th
                    className="cursor-pointer"
                    onClick={() => handleSort("allowance")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Phụ cấp</span>
                      {getSortIcon("allowance")}
                    </div>
                  </th>
                  <th
                    className="cursor-pointer"
                    onClick={() => handleSort("bonus")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Thưởng</span>
                      {getSortIcon("bonus")}
                    </div>
                  </th>
                  <th
                    className="cursor-pointer"
                    onClick={() => handleSort("penalty")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Phạt</span>
                      {getSortIcon("penalty")}
                    </div>
                  </th>
                  <th
                    className="cursor-pointer"
                    onClick={() => handleSort("total_salary")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Tổng</span>
                      {getSortIcon("total_salary")}
                    </div>
                  </th>
                  <th style={{ width: "180px" }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSorted.length > 0 ? (
                  filteredAndSorted.map((p) => (
                    <tr key={p.id}>
                      <td>
                        {p.employee?.full_name ||
                          getEmployeeName(p.employee_id)}
                      </td>
                      <td>
                        {p.month}/{p.year}
                      </td>
                      <td>{p.base_salary.toLocaleString("vi-VN")}₫</td>
                      <td>{p.allowance.toLocaleString("vi-VN")}₫</td>
                      <td>{p.bonus.toLocaleString("vi-VN")}₫</td>
                      <td>{p.penalty.toLocaleString("vi-VN")}₫</td>
                      <td className="fw-bold text-primary">
                        {p.total_salary.toLocaleString("vi-VN")}₫
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-info text-white me-1"
                          onClick={() => navigate(`/payrolls/${p.id}`)}
                          title="Xem chi tiết"
                        >
                          <FaEye />
                        </button>
                        <button
                          className="btn btn-sm btn-warning me-1"
                          onClick={() => navigate(`/payrolls/${p.id}/edit`)}
                          title="Chỉnh sửa"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() =>
                            handleDelete(
                              p.id,
                              p.employee?.full_name ||
                                getEmployeeName(p.employee_id),
                              p.month,
                              p.year
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
                    <td colSpan={8} className="text-center py-4 text-muted">
                      <FaInbox className="me-2" />
                      Không có dữ liệu bảng lương phù hợp.
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

export default PayrollList;
