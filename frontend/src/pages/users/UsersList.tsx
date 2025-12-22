import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiGet, apiDelete } from "../../api/client";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaInbox } from "react-icons/fa";

// Kiểu theo UserResponse (schemas)
type User = {
  id: number;
  full_name: string;
  email: string;
  role: string;
  status: string;
};

const UsersList: React.FC = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load danh sách user
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await apiGet<User[]>("/users");
      setUsers(data);
    } catch (err) {
      console.error("Lỗi tải danh sách user:", err);
      setError("Không thể tải danh sách tài khoản.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Lọc theo tên hoặc email
  const filtered = users.filter(
    (u) =>
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa user "${name}"?`)) return;

    try {
      await apiDelete(`/users/${id}`);
      alert("Xóa user thành công!");
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Không thể xóa user.");
    }
  };

  if (loading) return <p className="m-3 text-center">Đang tải dữ liệu...</p>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h3 className="fw-bold mb-0">Danh sách User</h3>
        </div>

        <div className="card-body">
          {/* SEARCH + ADD */}
          <div className="row g-3 mb-4 align-items-center">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Tìm theo tên hoặc email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-6 text-md-end">
              <button
                className="btn btn-primary"
                onClick={() => navigate("/users/create")}
              >
                <FaPlus className="me-1" /> Thêm User
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Vai trò</th>
                  <th>Trạng thái</th>
                  <th style={{ width: "160px" }}>Hành động</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id}>
                    <td>{u.full_name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className="badge bg-primary">{u.role}</span>
                    </td>
                    <td>
                      <span
                        className={
                          u.status === "active"
                            ? "badge bg-success"
                            : "badge bg-secondary"
                        }
                      >
                        {u.status === "active"
                          ? "Hoạt động"
                          : "Ngưng hoạt động"}
                      </span>
                    </td>

                    <td>
                      {/* EDIT */}
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => navigate(`/users/${u.id}/edit`)}
                        title="Chỉnh sửa"
                      >
                        <FaEdit />
                      </button>

                      {/* DELETE */}
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(u.id, u.full_name)}
                        title="Xóa"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-muted">
                      <FaInbox className="me-2" />
                      Không tìm thấy User nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersList;
