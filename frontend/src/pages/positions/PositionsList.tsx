import React, { useEffect, useState } from "react";
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
} from "react-icons/fa";

// Type theo PositionResponse (schemas)
type Position = {
  id: number;
  name: string;
  description?: string | null;
  level: number;
};

const PositionsList: React.FC = () => {
  const navigate = useNavigate();

  const [positions, setPositions] = useState<Position[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔥 Tách logic fetch dữ liệu ra một hàm riêng để có thể gọi lại
  const fetchPositions = async () => {
    try {
      setLoading(true);
      const data = await apiGet<Position[]>("/positions");
      setPositions(data);
    } catch (err: any) {
      console.error("Lỗi tải danh sách chức vụ:", err);
      setError("Không thể tải danh sách chức vụ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  // SEARCH FILTER
  const filtered = positions.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // 🔥 Hàm xử lý xóa chức vụ
  const handleDelete = async (id: number, name: string) => {
    const confirmDelete = window.confirm(
      `Bạn có chắc chắn muốn xóa chức vụ "${name}"?`
    );
    if (!confirmDelete) {
      return;
    }

    try {
      await apiDelete(`/positions/${id}`);
      alert("Xóa chức vụ thành công!");
      // Tải lại danh sách chức vụ sau khi xóa thành công
      fetchPositions();
    } catch (err) {
      console.error(err);
      alert("Lỗi! Không thể xóa chức vụ.");
    }
  };

  if (loading) return <p className="m-3 text-center">Đang tải dữ liệu...</p>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h3 className="fw-bold mb-0">Danh sách chức vụ</h3>
        </div>
        <div className="card-body">
          {/* SEARCH + ADD BUTTON */}
          <div className="row g-3 mb-4 align-items-center">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Tìm theo tên chức vụ..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6 text-md-end">
              <button
                className="btn btn-primary"
                onClick={() => navigate("/positions/create")}
              >
                <FaPlus className="me-1" /> Thêm chức vụ
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Tên chức vụ</th>
                  <th>Level</th>
                  <th>Mô tả</th>
                  <th style={{ width: "180px" }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>
                      <span className="badge bg-secondary">
                        Level {p.level}
                      </span>
                    </td>
                    <td>{p.description || "—"}</td>

                    <td>
                      <button
                        className="btn btn-sm btn-info text-white me-1"
                        onClick={() => navigate(`/positions/${p.id}`)}
                        title="Xem chi tiết"
                      >
                        <FaEye />
                      </button>

                      <button
                        className="btn btn-sm btn-warning me-1"
                        onClick={() => navigate(`/positions/${p.id}/edit`)}
                        title="Chỉnh sửa"
                      >
                        <FaEdit />
                      </button>

                      {/* NÚT XÓA ĐÃ ĐƯỢC CẬP NHẬT */}
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(p.id, p.name)}
                        title="Xóa chức vụ"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-muted">
                      <FaInbox className="me-2" />
                      Không tìm thấy chức vụ nào.
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

export default PositionsList;
