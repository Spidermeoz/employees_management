import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// MOCK DEPARTMENTS
const mockDepartments = [
  {
    id: 1,
    name: "Phòng Kế Toán",
    description: "Xử lý sổ sách và báo cáo tài chính",
    manager_id: 1,
    phone: "0901112222",
  },
  {
    id: 2,
    name: "Phòng Nhân Sự",
    description: "Quản lý nhân lực và tuyển dụng",
    manager_id: 2,
    phone: "0903334444",
  },
  {
    id: 3,
    name: "Phòng IT",
    description: "Phát triển phần mềm và quản lý hệ thống",
    manager_id: 3,
    phone: "0905556666",
  },
];

// MOCK EMPLOYEES
const mockEmployees = [
  { id: 1, code: "NV001", name: "Nguyễn Văn A", department_id: 1, position: "Kế toán viên", status: "active" },
  { id: 2, code: "NV002", name: "Trần Thị B", department_id: 2, position: "HR Executive", status: "active" },
  { id: 3, code: "NV003", name: "Phạm Văn C", department_id: 3, position: "Developer", status: "active" },
  { id: 4, code: "NV004", name: "Lê Thị D", department_id: 3, position: "Tester", status: "inactive" },
];

const DepartmentDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [department, setDepartment] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [managerName, setManagerName] = useState<string>("");

  useEffect(() => {
    const dept = mockDepartments.find((d) => d.id === Number(id));

    if (dept) {
      setDepartment(dept);

      // Find manager name
      const manager = mockEmployees.find((e) => e.id === dept.manager_id);
      setManagerName(manager ? manager.name : "Chưa chọn");

      // Employees in this department
      const empList = mockEmployees.filter((e) => e.department_id === dept.id);
      setEmployees(empList);
    }
  }, [id]);

  if (!department) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Chi tiết phòng ban</h3>

      {/* DEPARTMENT INFO */}
      <div className="card p-4 shadow-sm border-0 mb-4">
        <h4 className="fw-bold mb-2">{department.name}</h4>

        <p><strong>Mô tả:</strong> {department.description}</p>
        <p><strong>Trưởng phòng:</strong> {managerName}</p>
        <p><strong>Số điện thoại:</strong> {department.phone}</p>

        <div className="mt-3 d-flex gap-3">
          <button
            className="btn btn-warning"
            onClick={() => navigate(`/departments/${department.id}/edit`)}
          >
            ✏ Sửa phòng ban
          </button>
          <button className="btn btn-secondary" onClick={() => navigate("/departments")}>
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
              <th>Chức vụ</th>
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
