import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import { apiGet } from "../../api/client";
import {
  FaEdit,
  FaArrowLeft,
  FaUsers,
  FaInbox,
  FaBuilding,
} from "react-icons/fa";

// Kiểu dữ liệu đồng bộ với backend
type Department = {
  id: number;
  name: string;
  description?: string | null;
  phone?: string | null;
  manager_id?: number | null;
};

type Employee = {
  id: number;
  code: string;
  full_name: string;
  position_id?: number | null;
  status: string;
};

const DepartmentDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [department, setDepartment] = useState<Department | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [managerName, setManagerName] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // 🔥 Load dữ liệu phòng ban + trưởng phòng + nhân viên
  useEffect(() => {
    const loadData = async () => {
      try {
        if (!id) return;

        // 1️⃣ Lấy phòng ban
        const dept = await apiGet<Department>(`/departments/${id}`);
        setDepartment(dept);

        // 2️⃣ Lấy tên trưởng phòng
        if (dept.manager_id) {
          try {
            const manager = await apiGet<Employee>(
              `/employees/${dept.manager_id}`
            );
            setManagerName(manager.full_name);
          } catch {
            setManagerName("Không tìm thấy");
          }
        } else {
          setManagerName("Chưa chọn");
        }

        // 3️⃣ Nhân viên trong phòng
        const empList = await apiGet<Employee[]>(
          `/employees?department_id=${dept.id}`
        );
        setEmployees(empList);
      } catch (error: any) {
        console.error("Lỗi load dữ liệu:", error);
        setErr("Không thể tải thông tin phòng ban.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) return <p className="m-3 text-center">Đang tải dữ liệu...</p>;

  if (err) return <div className="alert alert-danger m-3">{err}</div>;

  if (!department) return <p className="m-3">Không tìm thấy phòng ban.</p>;

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="card shadow-sm border-0">
        {/* HEADER */}
        <div className="card-header bg-white py-3">
          <h3 className="fw-bold mb-0">
            <FaBuilding className="me-2" />
            Chi tiết phòng ban
          </h3>
        </div>

        <div className="card-body">
          {/* DEPARTMENT INFO CARD */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h4 className="fw-bold mb-2">{department.name}</h4>

                  <p className="mb-1 text-muted">
                    <strong>Mô tả:</strong> {department.description || "—"}
                  </p>
                  <p className="mb-1 text-muted">
                    <strong>Trưởng phòng:</strong> {managerName}
                  </p>
                  <p className="mb-0 text-muted">
                    <strong>Số điện thoại:</strong> {department.phone || "—"}
                  </p>
                </div>

                <div>
                  <button
                    className="btn btn-warning me-2"
                    onClick={() =>
                      navigate(`/departments/${department.id}/edit`)
                    }
                  >
                    <FaEdit className="me-1" /> Sửa
                  </button>

                  <button
                    className="btn btn-secondary"
                    onClick={() => navigate("/departments")}
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
                Nhân viên trong phòng ({employees.length})
              </h5>
            </div>

            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Mã NV</th>
                      <th>Họ tên</th>
                      <th>ID Chức vụ</th>
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
                          <td>{emp.position_id || "—"}</td>

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
                              👁
                            </button>

                            <button
                              className="btn btn-sm btn-warning"
                              onClick={() =>
                                navigate(`/employees/${emp.id}/edit`)
                              }
                              title="Chỉnh sửa"
                            >
                              ✏
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-4 text-muted">
                          <FaInbox className="me-2" />
                          Không có nhân viên trong phòng này.
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

export default DepartmentDetail;
