import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Mock positions
const mockPositions = [
  {
    id: 1,
    name: "Nhân viên",
    level: 1,
    description: "Cấp độ nhân viên cơ bản",
  },
  {
    id: 2,
    name: "Trưởng nhóm",
    level: 2,
    description: "Quản lý nhóm nhỏ",
  },
  {
    id: 3,
    name: "Trưởng phòng",
    level: 3,
    description: "Quản lý toàn bộ phòng ban",
  },
];

// Mock employees
const mockEmployees = [
  { id: 1, code: "NV001", name: "Nguyễn Văn A", position_id: 1, department: "Phòng Kế toán", status: "active" },
  { id: 2, code: "NV002", name: "Trần Thị B", position_id: 2, department: "Phòng Nhân sự", status: "active" },
  { id: 3, code: "NV003", name: "Phạm Văn C", position_id: 3, department: "Phòng IT", status: "active" },
  { id: 4, code: "NV004", name: "Lê Thị D", position_id: 3, department: "Phòng IT", status: "inactive" },
];

const PositionDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [position, setPosition] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    // Load position info
    const pos = mockPositions.find((p) => p.id === Number(id));
    setPosition(pos || null);

    // Load employees assigned to this position
    const posEmployees = mockEmployees.filter((e) => e.position_id === Number(id));
    setEmployees(posEmployees);
  }, [id]);

  if (!position) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Chi tiết chức vụ</h3>

      {/* POSITION CARD */}
      <div className="card p-4 shadow-sm border-0 mb-4">
        <h4 className="fw-bold mb-2">
          {position.name} <span className="badge bg-secondary">Level {position.level}</span>
        </h4>

        <p><strong>Mô tả:</strong> {position.description}</p>

        <div className="mt-3 d-flex gap-3">
          <button
            className="btn btn-warning"
            onClick={() => navigate(`/positions/${position.id}/edit`)}
          >
            ✏ Sửa chức vụ
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => navigate("/positions")}
          >
            ↩ Quay lại
          </button>
        </div>
      </div>

      {/* EMPLOYEES TABLE */}
      <div className="card shadow-sm border-0 p-4">
        <h5 className="fw-bold mb-3">Nhân viên giữ chức vụ này</h5>

        <table className="table table-striped">
          <thead className="table-light">
            <tr>
              <th>Mã NV</th>
              <th>Tên</th>
              <th>Phòng ban</th>
              <th>Trạng thái</th>
              <th style={{ width: "150px" }}>Hành động</th>
            </tr>
          </thead>

          <tbody>
            {employees.length > 0 ? (
              employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.code}</td>
                  <td>{emp.name}</td>
                  <td>{emp.department}</td>
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
                    <button
                      className="btn btn-sm btn-info me-2"
                      onClick={() => navigate(`/employees/${emp.id}`)}
                    >
                      👁 Xem
                    </button>
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => navigate(`/employees/${emp.id}/edit`)}
                    >
                      ✏ Sửa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-3 text-muted">
                  Không có nhân viên nào giữ chức vụ này.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PositionDetail;
