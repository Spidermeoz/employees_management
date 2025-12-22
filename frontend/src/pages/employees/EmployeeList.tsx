import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiGet, apiDelete } from "../../api/client";
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

/* ================= TYPES ================= */

type Employee = {
  id: number;
  code: string;
  full_name: string;
  status: string;
  avatar?: string | null;
  department?: { name: string };
  position?: { name: string };
};

type SortConfig = {
  key: keyof Employee | "department.name" | "position.name";
  direction: "asc" | "desc";
};

type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  page_size: number;
};

/* ================= COMPONENT ================= */

const EmployeeList: React.FC = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* FILTER */
  const [search, setSearch] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  /* SORT */
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  /* PAGINATION */
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [total, setTotal] = useState(0);

  /* ================= FETCH ================= */

  const fetchEmployees = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        page_size: pageSize.toString(),
      });

      const data = await apiGet<PaginatedResponse<Employee>>(
        "/employees/paged?page=1&page_size=10"
      );

      setEmployees(data.items);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách nhân viên.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [currentPage]);

  /* ================= SORT ================= */

  const handleSort = (key: SortConfig["key"]) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: SortConfig["key"]) => {
    if (!sortConfig || sortConfig.key !== key) return <FaSort />;
    return sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  /* ================= FILTER + SORT ================= */

  const departmentList = useMemo(() => {
    const depts = new Set(
      employees.map((e) => e.department?.name).filter(Boolean)
    );
    return Array.from(depts);
  }, [employees]);

  const sortedAndFilteredEmployees = useMemo(() => {
    let data = employees.filter((emp) => {
      const matchSearch = emp.full_name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchDept = filterDepartment
        ? emp.department?.name === filterDepartment
        : true;
      const matchStatus = filterStatus ? emp.status === filterStatus : true;
      return matchSearch && matchDept && matchStatus;
    });

    if (sortConfig) {
      data.sort((a, b) => {
        const getValue = (obj: any) =>
          sortConfig.key.includes(".")
            ? sortConfig.key.split(".").reduce((o, i) => o?.[i], obj)
            : obj[sortConfig.key];

        const av = getValue(a);
        const bv = getValue(b);

        if (av == null) return 1;
        if (bv == null) return -1;

        if (av < bv) return sortConfig.direction === "asc" ? -1 : 1;
        if (av > bv) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [employees, search, filterDepartment, filterStatus, sortConfig]);

  /* ================= DELETE ================= */

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Xóa nhân viên "${name}"?`)) return;
    await apiDelete(`/employees/${id}`);
    fetchEmployees();
  };

  if (loading) return <p className="text-center m-3">Đang tải...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const totalPages = Math.ceil(total / pageSize);
  const defaultAvatar =
    "https://res.cloudinary.com/demo/image/upload/v169110/default_avatar.png";

  /* ================= RENDER ================= */

  return (
    <div className="container-fluid p-4">
      <div className="card shadow-sm">
        <div className="card-header bg-white">
          <h3 className="fw-bold mb-0">Danh sách nhân viên</h3>
        </div>

        <div className="card-body">
          {/* FILTER */}
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaSearch />
                </span>
                <input
                  className="form-control"
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
                {departmentList.map((d) => (
                  <option key={d}>{d}</option>
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

            <div className="col-md-4 text-end">
              <button
                className="btn btn-primary"
                onClick={() => navigate("/employees/create")}
              >
                <FaPlus /> Thêm nhân viên
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Avatar</th>
                  <th onClick={() => handleSort("code")}>
                    Mã NV {getSortIcon("code")}
                  </th>
                  <th onClick={() => handleSort("full_name")}>
                    Tên {getSortIcon("full_name")}
                  </th>
                  <th onClick={() => handleSort("department.name")}>
                    Phòng ban {getSortIcon("department.name")}
                  </th>
                  <th onClick={() => handleSort("position.name")}>
                    Chức vụ {getSortIcon("position.name")}
                  </th>
                  <th onClick={() => handleSort("status")}>
                    Trạng thái {getSortIcon("status")}
                  </th>
                  <th>Hành động</th>
                </tr>
              </thead>

              <tbody>
                {sortedAndFilteredEmployees.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <img
                        src={emp.avatar || defaultAvatar}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
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
                      <button
                        className="btn btn-sm btn-info me-1"
                        onClick={() => navigate(`/employees/${emp.id}`)}
                      >
                        <FaEye />
                      </button>
                      <button
                        className="btn btn-sm btn-warning me-1"
                        onClick={() => navigate(`/employees/${emp.id}/edit`)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(emp.id, emp.full_name)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <nav className="mt-3">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 && "disabled"}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  «
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <li
                  key={p}
                  className={`page-item ${p === currentPage && "active"}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(p)}
                  >
                    {p}
                  </button>
                </li>
              ))}

              <li
                className={`page-item ${
                  currentPage === totalPages && "disabled"
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  »
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;
