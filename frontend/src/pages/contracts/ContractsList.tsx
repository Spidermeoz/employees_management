import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiGet, apiDelete } from "../../api/client"; // 🔥 Thêm apiDelete
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaInbox,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaFileContract,
} from "react-icons/fa";

// Kiểu dữ liệu từ ContractResponse
type Contract = {
  id: number;
  contract_type: string;
  start_date: string;
  end_date?: string | null;
  file_url?: string | null;
  employee: {
    id: number;
    full_name: string;
  };
};

// Kiểu dữ liệu cho cấu hình sắp xếp
type SortConfig = {
  key: keyof Contract | "employee.full_name";
  direction: "asc" | "desc";
};

const ContractsList: React.FC = () => {
  const navigate = useNavigate();

  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State cho tìm kiếm và lọc
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // "all", "active", "expired"

  // State cho sắp xếp
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  // 🔥 Load dữ liệu thật từ backend
  const fetchContracts = async () => {
    try {
      setLoading(true);
      const data = await apiGet<Contract[]>("/contracts");
      setContracts(data);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách hợp đồng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
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

  // Kiểm tra hợp đồng đã hết hạn
  const isExpired = (end?: string | null) => {
    if (!end) return false;
    return new Date(end) < new Date();
  };

  // 🔥 Logic lọc và sắp xếp dữ liệu (sử dụng useMemo để tối ưu hiệu năng)
  const filteredAndSortedContracts = useMemo(() => {
    let filteredContracts = contracts.filter((c) => {
      const matchesSearch = c.employee.full_name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus = (() => {
        switch (statusFilter) {
          case "active":
            return !isExpired(c.end_date);
          case "expired":
            return isExpired(c.end_date);
          default:
            return true;
        }
      })();

      return matchesSearch && matchesStatus;
    });

    // Áp dụng sắp xếp
    if (sortConfig !== null) {
      filteredContracts.sort((a, b) => {
        const aValue = sortConfig.key.includes(".")
          ? sortConfig.key.split(".").reduce((o, i) => (o as any)?.[i], a)
          : a[sortConfig.key as keyof Contract];

        const bValue = sortConfig.key.includes(".")
          ? sortConfig.key.split(".").reduce((o, i) => (o as any)?.[i], b)
          : b[sortConfig.key as keyof Contract];

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

    return filteredContracts;
  }, [contracts, search, statusFilter, sortConfig]);

  // 🔥 Hàm xử lý xóa hợp đồng
  const handleDelete = async (id: number, employeeName: string) => {
    const confirmDelete = window.confirm(
      `Bạn có chắc chắn muốn xóa hợp đồng của "${employeeName}"?`
    );
    if (!confirmDelete) {
      return;
    }

    try {
      await apiDelete(`/contracts/${id}`);
      alert("Xóa hợp đồng thành công!");
      // Tải lại danh sách hợp đồng sau khi xóa thành công
      fetchContracts();
    } catch (err) {
      console.error(err);
      alert("Lỗi! Không thể xóa hợp đồng.");
    }
  };

  if (loading) return <p className="m-3 text-center">Đang tải dữ liệu...</p>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h3 className="fw-bold mb-0">Danh sách hợp đồng</h3>
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
                  placeholder="Tìm theo tên nhân viên..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="active">Còn hiệu lực</option>
                <option value="expired">Hết hạn</option>
              </select>
            </div>
            <div className="col-md-5 text-md-end">
              <button
                className="btn btn-primary"
                onClick={() => navigate("/contracts/create")}
              >
                <FaPlus className="me-1" /> Thêm hợp đồng
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th
                    onClick={() => handleSort("employee.full_name")}
                    style={{ cursor: "pointer", userSelect: "none" }}
                  >
                    Nhân viên {getSortIcon("employee.full_name")}
                  </th>
                  <th>Loại hợp đồng</th>
                  <th
                    onClick={() => handleSort("start_date")}
                    style={{ cursor: "pointer", userSelect: "none" }}
                  >
                    Bắt đầu {getSortIcon("start_date")}
                  </th>
                  <th
                    onClick={() => handleSort("end_date")}
                    style={{ cursor: "pointer", userSelect: "none" }}
                  >
                    Kết thúc {getSortIcon("end_date")}
                  </th>
                  <th>Trạng thái</th>
                  <th>File</th>
                  <th style={{ width: "180px" }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedContracts.map((c) => (
                  <tr key={c.id}>
                    <td>{c.employee.full_name}</td>
                    <td>{c.contract_type}</td>
                    <td>{c.start_date}</td>
                    <td>{c.end_date || "—"}</td>
                    <td>
                      <span
                        className={`badge ${
                          isExpired(c.end_date) ? "bg-danger" : "bg-success"
                        }`}
                      >
                        {isExpired(c.end_date) ? "Hết hạn" : "Còn hiệu lực"}
                      </span>
                    </td>
                    <td>
                      {c.file_url ? (
                        <a
                          href={c.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-secondary"
                        >
                          <FaFileContract /> Xem
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-info text-white me-1"
                        onClick={() => navigate(`/contracts/${c.id}`)}
                        title="Xem chi tiết"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="btn btn-sm btn-warning me-1"
                        onClick={() => navigate(`/contracts/${c.id}/edit`)}
                        title="Chỉnh sửa"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(c.id, c.employee.full_name)}
                        title="Xóa hợp đồng"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredAndSortedContracts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-muted">
                      <FaInbox className="me-2" />
                      Không tìm thấy hợp đồng nào.
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

export default ContractsList;
