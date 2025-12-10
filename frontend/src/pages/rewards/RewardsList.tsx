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
  FaCalendarAlt,
  FaInbox,
} from "react-icons/fa";

type RewardItem = {
  id: number;
  employee_id: number;
  type: "reward" | "discipline";
  title: string;
  amount: number;
  date: string;
};

type Employee = {
  id: number;
  full_name: string;
};

// 📌 Lấy tháng hiện tại dạng YYYY-MM
const getCurrentMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

const RewardsList: React.FC = () => {
  const navigate = useNavigate();

  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State cho tìm kiếm và lọc
  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState(getCurrentMonth()); // mặc định tháng này

  // 🔥 Tách logic fetch dữ liệu ra một hàm riêng để có thể gọi lại
  const fetchRewards = async () => {
    try {
      setLoading(true);
      const [rewardData, employeeData] = await Promise.all([
        apiGet<RewardItem[]>("/rewards"),
        apiGet<Employee[]>("/employees"),
      ]);
      setRewards(rewardData);
      setEmployees(employeeData);
    } catch (err) {
      console.error(err);
      setError("Không thể tải dữ liệu thưởng / kỷ luật.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  // Tạo map employee_id → employee_name
  const employeeMap: Record<number, string> = useMemo(() => {
    const map: Record<number, string> = {};
    employees.forEach((emp) => {
      map[emp.id] = emp.full_name;
    });
    return map;
  }, [employees]);

  // 🔥 Hàm xử lý xóa thưởng/kỷ luật
  const handleDelete = async (id: number, title: string) => {
    const confirmDelete = window.confirm(
      `Bạn có chắc chắn muốn xóa mục "${title}"?`
    );
    if (!confirmDelete) {
      return;
    }

    try {
      await apiDelete(`/rewards/${id}`);
      alert("Xóa thành công!");
      // Tải lại danh sách sau khi xóa thành công
      fetchRewards();
    } catch (err) {
      console.error(err);
      alert("Lỗi! Không thể xóa.");
    }
  };

  // 🔥 Logic lọc và sắp xếp dữ liệu (sử dụng useMemo để tối ưu hiệu năng)
  const filteredRewards = useMemo(() => {
    return rewards.filter((r) => {
      const matchesSearch = employeeMap[r.employee_id]
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchesMonth = r.date.startsWith(monthFilter);

      return matchesSearch && matchesMonth;
    });
  }, [rewards, search, monthFilter, employeeMap]);

  if (loading) return <p className="m-3 text-center">Đang tải dữ liệu...</p>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h3 className="fw-bold mb-0">Danh sách Thưởng / Kỷ luật</h3>
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
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaCalendarAlt />
                </span>
                <input
                  type="month"
                  className="form-control border-start-0"
                  value={monthFilter}
                  onChange={(e) => setMonthFilter(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-5 text-md-end">
              <button
                className="btn btn-primary"
                onClick={() => navigate("/rewards/create")}
              >
                <FaPlus className="me-1" /> Thêm mới
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Nhân viên</th>
                  <th>Loại</th>
                  <th>Tiêu đề</th>
                  <th>Số tiền</th>
                  <th>Ngày</th>
                  <th style={{ width: "180px" }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredRewards.map((item) => (
                  <tr key={item.id}>
                    <td>{employeeMap[item.employee_id] || "—"}</td>
                    <td>
                      {item.type === "reward" ? (
                        <span className="badge bg-success">Thưởng</span>
                      ) : (
                        <span className="badge bg-danger">Kỷ luật</span>
                      )}
                    </td>
                    <td>{item.title}</td>
                    <td>{item.amount.toLocaleString("vi-VN")}₫</td>
                    <td>{item.date}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-info text-white me-1"
                        onClick={() => navigate(`/rewards/${item.id}`)}
                        title="Xem chi tiết"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="btn btn-sm btn-warning me-1"
                        onClick={() => navigate(`/rewards/${item.id}/edit`)}
                        title="Chỉnh sửa"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(item.id, item.title)}
                        title="Xóa"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredRewards.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-muted">
                      <FaInbox className="me-2" />
                      Không tìm thấy mục nào phù hợp.
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

export default RewardsList;
