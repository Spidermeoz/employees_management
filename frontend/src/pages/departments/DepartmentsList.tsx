import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// MOCK DATA
const mockDepartments = [
  {
    id: 1,
    name: "Phòng Kế Toán",
    description: "Xử lý sổ sách và báo cáo tài chính",
    manager: "Nguyễn Văn A",
    phone: "0901112222",
  },
  {
    id: 2,
    name: "Phòng Nhân Sự",
    description: "Quản lý nhân lực và tuyển dụng",
    manager: "Trần Thị B",
    phone: "0903334444",
  },
  {
    id: 3,
    name: "Phòng IT",
    description: "Phát triển phần mềm và quản lý hệ thống",
    manager: "Phạm Văn C",
    phone: "0905556666",
  },
];

const DepartmentsList: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = mockDepartments.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Danh sách phòng ban</h3>

      {/* SEARCH + ADD BUTTON */}
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-25"
          placeholder="Tìm theo tên phòng ban..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="btn btn-primary"
          onClick={() => navigate("/departments/create")}
        >
          ➕ Thêm phòng ban
        </button>
      </div>

      {/* TABLE */}
      <div className="card shadow-sm border-0">
        <table className="table table-striped mb-0">
          <thead className="table-light">
            <tr>
              <th>Tên phòng</th>
              <th>Mô tả</th>
              <th>Trưởng phòng</th>
              <th>SĐT</th>
              <th style={{ width: "160px" }}>Hành động</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((d) => (
              <tr key={d.id}>
                <td>{d.name}</td>
                <td>{d.description}</td>
                <td>{d.manager}</td>
                <td>{d.phone}</td>

                <td>
                  {/* DETAIL */}
                  <button
                    className="btn btn-sm btn-info me-2"
                    onClick={() => navigate(`/departments/${d.id}`)}
                  >
                    👁 Xem
                  </button>

                  {/* EDIT */}
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => navigate(`/departments/${d.id}/edit`)}
                  >
                    ✏ Sửa
                  </button>

                  {/* DELETE */}
                  <button className="btn btn-sm btn-danger">🗑 Xóa</button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-3 text-muted">
                  Không tìm thấy phòng ban nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentsList;
