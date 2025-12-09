import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiGet } from "../../api/client";

// Kiểu dữ liệu dựa theo EmployeeResponse
type Employee = {
  id: number;
  code: string;
  full_name: string;
  status: string;
  avatar?: string | null;
  department?: {
    name: string;
  };
  position?: {
    name: string;
  };
};

const EmployeeList: React.FC = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔥 Load danh sách nhân viên từ backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await apiGet<Employee[]>("/employees");
        setEmployees(data);
      } catch (err) {
        console.error(err);
        setError("Không thể tải danh sách nhân viên.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const filtered = employees.filter((emp) =>
    emp.full_name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="m-3">Đang tải dữ liệu...</p>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;

  // Ảnh mặc định nếu nhân viên chưa có avatar
  const defaultAvatar =
    "https://res.cloudinary.com/demo/image/upload/v169110/default_avatar.png";

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
              <th>Avatar</th>
              <th>Mã NV</th>
              <th>Tên</th>
              <th>Phòng ban</th>
              <th>Chức vụ</th>
              <th>Trạng thái</th>
              <th style={{ width: "160px" }}>Hành động</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((emp) => (
              <tr key={emp.id}>
                {/* Avatar */}
                <td>
                  <img
                    src={emp.avatar || defaultAvatar}
                    alt="avatar"
                    style={{
                      width: "45px",
                      height: "45px",
                      objectFit: "cover",
                      borderRadius: "50%",
                      border: "1px solid #ddd",
                    }}
                  />
                </td>

                <td>{emp.code}</td>
                <td>{emp.full_name}</td>

                <td>{emp.department?.name || "—"}</td>
                <td>{emp.position?.name || "—"}</td>

                <td>
                  <span
                    className={
                      emp.status === "active"
                        ? "badge bg-success"
                        : "badge bg-secondary"
                    }
                  >
                    {emp.status === "active" ? "Đang làm" : "Không hoạt động"}
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

                  {/* DELETE */}
                  <button className="btn btn-sm btn-danger">🗑 Xóa</button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-3 text-muted">
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
