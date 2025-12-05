import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// MOCK DATA
const mockContracts = [
  {
    id: 1,
    employee: "Nguyễn Văn A",
    type: "HĐ Lao động 1 năm",
    start_date: "2023-01-01",
    end_date: "2024-01-01",
    file_url: "#",
  },
  {
    id: 2,
    employee: "Trần Thị B",
    type: "HĐ Lao động không thời hạn",
    start_date: "2022-05-15",
    end_date: "2025-05-15",
    file_url: "#",
  },
  {
    id: 3,
    employee: "Phạm Văn C",
    type: "HĐ Thời vụ 6 tháng",
    start_date: "2024-07-01",
    end_date: "2024-12-31",
    file_url: "#",
  },
];

const ContractsList: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // Filter by employee name
  const filtered = mockContracts.filter((c) =>
    c.employee.toLowerCase().includes(search.toLowerCase())
  );

  const isExpired = (end: string) => {
    return new Date(end) < new Date();
  };

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
                <td>{c.employee}</td>
                <td>{c.type}</td>
                <td>{c.start_date}</td>
                <td>{c.end_date}</td>

                <td>
                  {isExpired(c.end_date) ? (
                    <span className="badge bg-danger">Hết hạn</span>
                  ) : (
                    <span className="badge bg-success">Còn hiệu lực</span>
                  )}
                </td>

                <td>
                  <a href={c.file_url} target="_blank">
                    📄 Xem file
                  </a>
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
