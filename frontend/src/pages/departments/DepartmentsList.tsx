import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiGet, apiDelete } from "../../api/client";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaInbox,
} from "react-icons/fa";

type Department = {
  id: number;
  name: string;
  description?: string | null;
  phone?: string | null;
  manager_name?: string | null;
};

const DepartmentsList: React.FC = () => {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState<Department[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const data = await apiGet<Department[]>("/departments");
      setDepartments(data);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách phòng ban.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const filtered = departments.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  // DELETE HANDLER
  const handleDelete = async (id: number, name: string) => {
    const ok = window.confirm(`Bạn có chắc muốn xóa phòng ban "${name}"?`);
    if (!ok) return;

    try {
      await apiDelete(`/departments/${id}`);
      alert("Xóa phòng ban thành công!");
      fetchDepartments();
    } catch (err) {
      console.error(err);
      alert("Không thể xóa phòng ban.");
    }
  };

  if (loading) return <p className="m-3 text-center">Đang tải dữ liệu...</p>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h3 className="fw-bold mb-0">Danh sách phòng ban</h3>
        </div>

        <div className="card-body">
          {/* SEARCH + ADD BUTTON */}
          <div className="row g-3 mb-4 align-items-center">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Tìm theo tên phòng ban..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-6 text-md-end">
              <button
                className="btn btn-primary"
                onClick={() => navigate("/departments/create")}
              >
                <FaPlus className="me-1" /> Thêm phòng ban
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Tên phòng</th>
                  <th>Mô tả</th>
                  <th>Trưởng phòng</th>
                  <th>SĐT</th>
                  <th style={{ width: "180px" }}>Hành động</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id}>
                    <td>{d.name}</td>
                    <td>{d.description || "—"}</td>
                    <td>{d.manager_name || "—"}</td>
                    <td>{d.phone || "—"}</td>

                    <td>
                      <button
                        className="btn btn-sm btn-info text-white me-1"
                        onClick={() => navigate(`/departments/${d.id}`)}
                        title="Xem chi tiết"
                      >
                        <FaEye />
                      </button>

                      <button
                        className="btn btn-sm btn-warning me-1"
                        onClick={() => navigate(`/departments/${d.id}/edit`)}
                        title="Chỉnh sửa"
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(d.id, d.name)}
                        title="Xóa phòng ban"
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
                      Không tìm thấy phòng ban nào.
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

export default DepartmentsList;
