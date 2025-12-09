import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiGet } from "../../api/client";

interface Position {
  id: number;
  name: string;
  level: number;
  description?: string | null;
}

interface Employee {
  id: number;
  code: string;
  full_name: string;
  department_id?: number | null;
  status: string;
}

const PositionDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [position, setPosition] = useState<Position | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔥 Load info từ backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const pos = await apiGet<Position>(`/positions/${id}`);
        setPosition(pos);

        // Load employees theo position
        const empList = await apiGet<Employee[]>(
          `/employees?position_id=${id}`
        );
        setEmployees(empList);
      } catch (err) {
        console.error(err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <p className="m-3">Đang tải dữ liệu...</p>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;

  if (!position) return <p className="m-3">Không tìm thấy chức vụ.</p>;

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Chi tiết chức vụ</h3>

      {/* POSITION CARD */}
      <div className="card p-4 shadow-sm border-0 mb-4">
        <h4 className="fw-bold mb-2">
          {position.name}{" "}
          <span className="badge bg-secondary">Level {position.level}</span>
        </h4>

        <p>
          <strong>Mô tả:</strong> {position.description || "—"}
        </p>

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
              <th>Họ tên</th>
              <th>ID Phòng ban</th>
              <th>Trạng thái</th>
              <th style={{ width: "150px" }}>Hành động</th>
            </tr>
          </thead>

          <tbody>
            {employees.length > 0 ? (
              employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.code}</td>
                  <td>{emp.full_name}</td>
                  <td>{emp.department_id || "—"}</td>
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
