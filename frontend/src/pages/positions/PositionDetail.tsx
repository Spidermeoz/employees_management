import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiGet } from "../../api/client";
import {
  FaEdit,
  FaArrowLeft,
  FaEye,
  FaUsers,
  FaInbox,
} from "react-icons/fa";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pos = await apiGet<Position>(`/positions/${id}`);
        setPosition(pos);

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

  if (loading) return <p className="m-3 text-center">Đang tải dữ liệu...</p>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;
  if (!position) return <p className="m-3">Không tìm thấy chức vụ.</p>;

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h3 className="fw-bold mb-0">Chi tiết chức vụ</h3>
        </div>
        <div className="card-body">
          {/* POSITION INFO CARD */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h4 className="fw-bold mb-1">
                    {position.name}{" "}
                    <span className="badge bg-secondary ms-2">
                      Level {position.level}
                    </span>
                  </h4>
                  <p className="mb-0 text-muted">
                    {position.description || "Không có mô tả."}
                  </p>
                </div>
                <div>
                  <button
                    className="btn btn-warning me-2"
                    onClick={() => navigate(`/positions/${position.id}/edit`)}
                  >
                    <FaEdit className="me-1" /> Sửa
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => navigate("/positions")}
                  >
                    <FaArrowLeft className="me-1" /> Quay lại
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* EMPLOYEES TABLE */}
          <div className="card">
            <div className="card-header bg-light">
              <h5 className="fw-bold mb-0">
                <FaUsers className="me-2" />
                Nhân viên giữ chức vụ này ({employees.length})
              </h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover align-middle">
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
                              className={`badge ${
                                emp.status === "active"
                                  ? "bg-success"
                                  : "bg-secondary"
                              }`}
                            >
                              {emp.status === "active"
                                ? "Đang làm"
                                : "Nghỉ việc"}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-info text-white me-2"
                              onClick={() => navigate(`/employees/${emp.id}`)}
                              title="Xem chi tiết"
                            >
                              <FaEye />
                            </button>
                            <button
                              className="btn btn-sm btn-warning"
                              onClick={() =>
                                navigate(`/employees/${emp.id}/edit`)
                              }
                              title="Chỉnh sửa"
                            >
                              <FaEdit />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-4 text-muted">
                          <FaInbox className="me-2" />
                          Không có nhân viên nào giữ chức vụ này.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositionDetail;
