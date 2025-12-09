import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiGet } from "../../api/client";

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

const ContractsList: React.FC = () => {
  const navigate = useNavigate();

  const [contracts, setContracts] = useState<Contract[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data từ API backend
  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const data = await apiGet<Contract[]>("/contracts");
        setContracts(data);
      } catch (err) {
        console.error(err);
        setError("Không thể tải danh sách hợp đồng.");
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  // Filter theo tên nhân viên
  const filtered = contracts.filter((c) =>
    c.employee.full_name.toLowerCase().includes(search.toLowerCase())
  );

  const isExpired = (end?: string | null) => {
    if (!end) return false;
    return new Date(end) < new Date();
  };

  if (loading) return <p className="m-3">Đang tải dữ liệu...</p>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Danh sách hợp đồng</h3>

      {/* SEARCH + ADD */}
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-25"
          placeholder="Tìm theo tên nhân viên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="btn btn-primary"
          onClick={() => navigate("/contracts/create")}
        >
          ➕ Thêm hợp đồng
        </button>
      </div>

      {/* TABLE */}
      <div className="card shadow-sm border-0">
        <table className="table table-striped mb-0">
          <thead className="table-light">
            <tr>
              <th>Nhân viên</th>
              <th>Loại hợp đồng</th>
              <th>Bắt đầu</th>
              <th>Kết thúc</th>
              <th>Trạng thái</th>
              <th>File</th>
              <th style={{ width: "150px" }}>Hành động</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((c) => (
              <tr key={c.id}>
                <td>{c.employee.full_name}</td>
                <td>{c.contract_type}</td>
                <td>{c.start_date}</td>
                <td>{c.end_date || "—"}</td>

                <td>
                  {c.end_date && isExpired(c.end_date) ? (
                    <span className="badge bg-danger">Hết hạn</span>
                  ) : (
                    <span className="badge bg-success">Còn hiệu lực</span>
                  )}
                </td>

                <td>
                  {c.file_url ? (
                    <a href={c.file_url} target="_blank">
                      📄 Xem file
                    </a>
                  ) : (
                    "—"
                  )}
                </td>

                <td>
                  <button
                    className="btn btn-sm btn-info me-2"
                    onClick={() => navigate(`/contracts/${c.id}`)}
                  >
                    👁 Xem
                  </button>

                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => navigate(`/contracts/${c.id}/edit`)}
                  >
                    ✏ Sửa
                  </button>

                  <button className="btn btn-sm btn-danger">🗑 Xóa</button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-3 text-muted">
                  Không tìm thấy hợp đồng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContractsList;
