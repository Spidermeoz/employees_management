import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiGet, apiDelete } from "../../api/client"; // 🔥 Thêm apiDelete vào đây
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaPlus,
  FaSearch,
} from "react-icons/fa";

// Kiểu dữ liệu dựa theo EmployeeResponse
type Employee = {
  id: number;
  code: string;
  full_name: string;
  status: string;
  avatar?: string | null;
  department?: {
    name: string;
  };
  position?: {
    name: string;
  };
};

// Kiểu dữ liệu cho cấu hình sắp xếp
type SortConfig = {
  key: keyof Employee | "department.name" | "position.name";
  direction: "asc" | "desc";
};

const EmployeeList: React.FC = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State cho tìm kiếm và lọc
  const [search, setSearch] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // State cho sắp xếp
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  // 🔥 Tách logic fetch dữ liệu ra một hàm riêng để có thể gọi lại
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await apiGet<Employee[]>("/employees");
      setEmployees(data);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách nhân viên.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Hàm xử lý sắp xếp
  const handleSort = (key: SortConfig["key"]) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Lấy icon sắp xếp cho tiêu đề cột
  const getSortIcon = (key: SortConfig["key"]) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <FaSort />;
    }
    return sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  // Tạo danh sách phòng ban duy nhất để lọc
  const departmentList = useMemo(() => {
    const depts = new Set(
      employees.map((emp) => emp.department?.name).filter(Boolean)
    );
    return Array.from(depts);
  }, [employees]);

  // 🔥 Logic lọc và sắp xếp dữ liệu (sử dụng useMemo để tối ưu hiệu năng)
  const sortedAndFilteredEmployees = useMemo(() => {
    let filteredEmployees = employees.filter((emp) => {
      const matchesSearch = emp.full_name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesDepartment = filterDepartment
        ? emp.department?.name === filterDepartment
        : true;
      const matchesStatus = filterStatus ? emp.status === filterStatus : true;

      return matchesSearch && matchesDepartment && matchesStatus;
    });

    // Áp dụng sắp xếp
    if (sortConfig !== null) {
      filteredEmployees.sort((a, b) => {
        const aValue = sortConfig.key.includes(".")
          ? sortConfig.key.split(".").reduce((o, i) => (o as any)?.[i], a)
          : a[sortConfig.key as keyof Employee];

        const bValue = sortConfig.key.includes(".")
          ? sortConfig.key.split(".").reduce((o, i) => (o as any)?.[i], b)
          : b[sortConfig.key as keyof Employee];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredEmployees;
  }, [employees, search, filterDepartment, filterStatus, sortConfig]);

  // 🔥 Hàm xử lý xóa nhân viên
  const handleDelete = async (id: number, fullName: string) => {
    const confirmDelete = window.confirm(
      `Bạn có chắc chắn muốn xóa nhân viên "${fullName}"?`
    );
    if (!confirmDelete) {
      return;
    }

    try {
      await apiDelete(`/employees/${id}`);
      alert("Xóa nhân viên thành công!");
      // Tải lại danh sách nhân viên sau khi xóa thành công
      fetchEmployees();
    } catch (err) {
      console.error(err);
      alert("Lỗi! Không thể xóa nhân viên.");
    }
  };

  if (loading) return <p className="m-3 text-center">Đang tải dữ liệu...</p>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;

  // Ảnh mặc định nếu nhân viên chưa có avatar
  const defaultAvatar =
    "https://res.cloudinary.com/demo/image/upload/v169110/default_avatar.png";

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h3 className="fw-bold mb-0">Danh sách nhân viên</h3>
        </div>
        <div className="card-body">
          {/* SEARCH + FILTERS + ACTIONS */}
          <div className="row g-3 mb-4 align-items-center">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Tìm theo tên..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
              >
                <option value="">Tất cả phòng ban</option>
                {departmentList.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="active">Đang làm</option>
                <option value="inactive">Không hoạt động</option>
              </select>
            </div>
            <div className="col-md-4 text-md-end">
              <button
                className="btn btn-primary"
                onClick={() => navigate("/employees/create")}
              >
                <FaPlus className="me-1" /> Thêm nhân viên
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Avatar</th>
                  <th
                    onClick={() => handleSort("code")}
                    style={{ cursor: "pointer", userSelect: "none" }}
                  >
                    Mã NV {getSortIcon("code")}
                  </th>
                  <th
                    onClick={() => handleSort("full_name")}
                    style={{ cursor: "pointer", userSelect: "none" }}
                  >
                    Tên {getSortIcon("full_name")}
                  </th>
                  <th
                    onClick={() => handleSort("department.name")}
                    style={{ cursor: "pointer", userSelect: "none" }}
                  >
                    Phòng ban {getSortIcon("department.name")}
                  </th>
                  <th
                    onClick={() => handleSort("position.name")}
                    style={{ cursor: "pointer", userSelect: "none" }}
                  >
                    Chức vụ {getSortIcon("position.name")}
                  </th>
                  <th
                    onClick={() => handleSort("status")}
                    style={{ cursor: "pointer", userSelect: "none" }}
                  >
                    Trạng thái {getSortIcon("status")}
                  </th>
                  <th style={{ width: "180px" }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {sortedAndFilteredEmployees.map((emp) => (
                  <tr key={emp.id}>
                    {/* Avatar */}
                    <td>
                      <img
                        src={emp.avatar || defaultAvatar}
                        alt="avatar"
                        style={{
                          width: "45px",
                          height: "45px",
                          objectFit: "cover",
                          borderRadius: "50%",
                          border: "1px solid #ddd",
                        }}
                      />
                    </td>
                    <td>{emp.code}</td>
                    <td>{emp.full_name}</td>
                    <td>{emp.department?.name || "—"}</td>
                    <td>{emp.position?.name || "—"}</td>
                    <td>
                      <span
                        className={`badge ${
                          emp.status === "active"
                            ? "bg-success"
                            : "bg-secondary"
                        }`}
                      >
                        {emp.status === "active"
                          ? "Đang làm"
                          : "Không hoạt động"}
                      </span>
                    </td>
                    <td>
                      {/* VIEW DETAIL */}
                      <button
                        className="btn btn-sm btn-info text-white me-1"
                        onClick={() => navigate(`/employees/${emp.id}`)}
                        title="Xem chi tiết"
                      >
                        <FaEye />
                      </button>

                      {/* EDIT */}
                      <button
                        className="btn btn-sm btn-warning me-1"
                        onClick={() => navigate(`/employees/${emp.id}/edit`)}
                        title="Chỉnh sửa"
                      >
                        <FaEdit />
                      </button>

                      {/* DELETE */}
                      {/* NÚT XÓA ĐÃ ĐƯỢC CẬP NHẬT */}
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(emp.id, emp.full_name)}
                        title="Xóa nhân viên"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}

                {sortedAndFilteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-muted">
                      Không tìm thấy nhân viên nào phù hợp với điều kiện lọc.
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

export default EmployeeList;
