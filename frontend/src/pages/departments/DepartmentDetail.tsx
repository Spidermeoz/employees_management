import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import { apiGet } from "../../api/client";

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

        // 1️⃣ Lấy thông tin phòng ban
        const dept = await apiGet<Department>(`/departments/${id}`);
        setDepartment(dept);

        // 2️⃣ Lấy tên Trưởng phòng (nếu có)
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

        // 3️⃣ Lấy danh sách nhân viên thuộc phòng
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

  if (loading) return <p className="m-3">Đang tải dữ liệu...</p>;
  if (err) return <div className="alert alert-danger m-3">{err}</div>;
  if (!department) return <p className="m-3">Không tìm thấy phòng ban.</p>;

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Chi tiết phòng ban</h3>

      {/* DEPARTMENT INFO */}
      <div className="card p-4 shadow-sm border-0 mb-4">
        <h4 className="fw-bold mb-2">{department.name}</h4>

        <p>
          <strong>Mô tả:</strong> {department.description || "—"}
        </p>
        <p>
          <strong>Trưởng phòng:</strong> {managerName}
        </p>
        <p>
          <strong>Số điện thoại:</strong> {department.phone || "—"}
        </p>

        <div className="mt-3 d-flex gap-3">
          <button
            className="btn btn-warning"
            onClick={() => navigate(`/departments/${department.id}/edit`)}
          >
            ✏ Sửa phòng ban
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => navigate("/departments")}
          >
            ↩ Quay lại
          </button>
        </div>
      </div>

      {/* EMPLOYEES LIST */}
      <div className="card shadow-sm border-0 p-4">
        <h5 className="fw-bold mb-3">Nhân viên trong phòng</h5>

        <table className="table table-striped">
          <thead className="table-light">
            <tr>
              <th>Mã NV</th>
              <th>Tên</th>
              <th>Chức vụ (ID)</th>
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
                  Không có nhân viên trong phòng này.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentDetail;
