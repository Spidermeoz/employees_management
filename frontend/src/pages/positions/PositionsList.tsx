import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiGet } from "../../api/client";

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

  // 🔥 Load data thật từ backend
  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const data = await apiGet<Position[]>("/positions");
        setPositions(data);
      } catch (err: any) {
        console.error("Lỗi tải danh sách chức vụ:", err);
        setError("Không thể tải danh sách chức vụ.");
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, []);

  // SEARCH FILTER
  const filtered = positions.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="m-3">Đang tải dữ liệu...</p>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Danh sách chức vụ</h3>

      {/* SEARCH + ADD BUTTON */}
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-25"
          placeholder="Tìm theo tên chức vụ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="btn btn-primary"
          onClick={() => navigate("/positions/create")}
        >
          ➕ Thêm chức vụ
        </button>
      </div>

      {/* TABLE */}
      <div className="card shadow-sm border-0">
        <table className="table table-striped mb-0">
          <thead className="table-light">
            <tr>
              <th>Tên chức vụ</th>
              <th>Level</th>
              <th>Mô tả</th>
              <th style={{ width: "160px" }}>Hành động</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>
                  <span className="badge bg-secondary">Level {p.level}</span>
                </td>
                <td>{p.description || "—"}</td>

                <td>
                  <button
                    className="btn btn-sm btn-info me-2"
                    onClick={() => navigate(`/positions/${p.id}`)}
                  >
                    👁 Xem
                  </button>

                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => navigate(`/positions/${p.id}/edit`)}
                  >
                    ✏ Sửa
                  </button>

                  <button className="btn btn-sm btn-danger">🗑 Xóa</button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-3 text-muted">
                  Không tìm thấy chức vụ nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PositionsList;
