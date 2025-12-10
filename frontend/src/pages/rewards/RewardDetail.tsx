import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiGet } from "../../api/client";
import {
  FaEdit,
  FaArrowLeft,
  FaUser,
  FaCalendarAlt,
  FaGift,
  FaExclamationTriangle,
} from "react-icons/fa";

type RewardItem = {
  id: number;
  employee_id: number;
  type: "reward" | "discipline";
  title: string;
  amount: number;
  date: string;
  note?: string | null;
};

type Employee = {
  id: number;
  full_name: string;
};

const RewardDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [reward, setReward] = useState<RewardItem | null>(null);
  const [employeeName, setEmployeeName] = useState<string>("Đang tải...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReward = async () => {
      try {
        const data = await apiGet<RewardItem>(`/rewards/${id}`);
        setReward(data);

        // Fetch employee name
        const emp = await apiGet<Employee>(`/employees/${data.employee_id}`);
        setEmployeeName(emp.full_name);
      } catch (err) {
        console.error(err);
        setError("Không thể tải thông tin thưởng/kỷ luật.");
      } finally {
        setLoading(false);
      }
    };

    loadReward();
  }, [id]);

  if (loading) return <p className="m-3 text-center">Đang tải dữ liệu...</p>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;
  if (!reward)
    return <p className="m-3 text-danger">Không tìm thấy dữ liệu.</p>;

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h3 className="fw-bold mb-0">
            Chi tiết {reward.type === "reward" ? "thưởng" : "kỷ luật"}
          </h3>
        </div>
        <div className="card-body">
          <div className="card mb-4">
            <div className="card-body">
              <h4 className="fw-bold mb-1">{reward.title}</h4>
              <p className="mb-0 text-muted">
                Dành cho nhân viên: {employeeName} - Mã: #{reward.employee_id}
              </p>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="card mb-3">
                <div className="card-header bg-light">
                  <h5 className="fw-bold mb-0">
                    <FaUser className="me-2" />
                    Thông tin chung
                  </h5>
                </div>
                <div className="card-body">
                  <p className="mb-1">
                    <strong>Loại:</strong>{" "}
                    <span
                      className={`badge ${
                        reward.type === "reward" ? "bg-success" : "bg-danger"
                      }`}
                    >
                      {reward.type === "reward" ? "Thưởng" : "Kỷ luật"}
                    </span>
                  </p>
                  <p className="mb-1">
                    <strong>Ngày:</strong> {reward.date}
                  </p>
                  <p className="mb-0">
                    <strong>Số tiền:</strong>{" "}
                    <span className="fw-bold text-primary">
                      {reward.amount.toLocaleString("vi-VN")}₫
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card mb-3">
                <div className="card-header bg-light">
                  <h5 className="fw-bold mb-0">
                    <FaGift className="me-2" />
                    Chi tiết {reward.type === "reward" ? "thưởng" : "kỷ luật"}
                  </h5>
                </div>
                <div className="card-body">
                  <p className="mb-0">{reward.note || "—"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              className="btn btn-warning px-4"
              onClick={() => navigate(`/rewards/${reward.id}/edit`)}
            >
              <FaEdit className="me-1" /> Sửa
            </button>
            <button
              className="btn btn-secondary px-4"
              onClick={() => navigate("/rewards")}
            >
              <FaArrowLeft className="me-1" /> Quay lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardDetail;
