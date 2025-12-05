import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const mockEmployees = [
  {
    id: 1,
    code: "NV001",
    name: "Nguyễn Văn A",
    department: "Phòng Kế Toán",
    position: "Kế toán viên",
    status: "active",
  },
  {
    id: 2,
    code: "NV002",
    name: "Trần Thị B",
    department: "Phòng Nhân sự",
    position: "HR Executive",
    status: "active",
  },
  {
    id: 3,
    code: "NV003",
    name: "Phạm Văn C",
    department: "Phòng IT",
    position: "Developer",
    status: "inactive",
  },
];

const EmployeeList: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filteredEmployees = mockEmployees.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Danh sách nhân viên</h3>

      {/* SEARCH + ACTIONS */}
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-25"
          placeholder="Tìm theo tên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="btn btn-primary"
          onClick={() => navigate("/employees/create")}
        >
          ➕ Thêm nhân viên
        </button>
      </div>

      {/* TABLE */}
      <div className="card shadow-sm border-0">
        <table className="table table-striped mb-0">
          <thead className="table-light">
            <tr>
              <th>Mã NV</th>
              <th>Tên</th>
              <th>Phòng ban</th>
              <th>Chức vụ</th>
              <th>Trạng thái</th>
              <th style={{ width: "160px" }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.code}</td>
                <td>{emp.name}</td>
                <td>{emp.department}</td>
                <td>{emp.position}</td>
                <td>
                  <span
                    className={
                      emp.status === "active"
                        ? "badge bg-success"
                        : "badge bg-secondary"
                    }
                  >
                    {emp.status === "active" ? "Đang làm" : "Nghỉ việc"}
                  </span>
                </td>

                <td>
                  {/* VIEW DETAIL */}
                  <button
                    className="btn btn-sm btn-info me-2"
                    onClick={() => navigate(`/employees/${emp.id}`)}
                  >
                    👁 Xem
                  </button>

                  {/* EDIT */}
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => navigate(`/employees/${emp.id}/edit`)}
                  >
                    ✏ Sửa
                  </button>

                  {/* DELETE (mock, chưa làm backend) */}
                  <button className="btn btn-sm btn-danger">🗑 Xóa</button>
                </td>
              </tr>
            ))}

            {filteredEmployees.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-3 text-muted">
                  Không tìm thấy nhân viên nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
