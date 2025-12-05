import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// MOCK EMPLOYEES
const mockEmployees = [
  { id: 1, name: "Nguyễn Văn A" },
  { id: 2, name: "Trần Thị B" },
  { id: 3, name: "Phạm Văn C" },
];

// MOCK CONTRACTS
const mockContracts = [
  {
    id: 1,
    employee_id: 1,
    type: "HĐ Lao động 1 năm",
    start_date: "2023-01-01",
    end_date: "2024-01-01",
    note: "Gia hạn sau 1 năm",
    file_url: "contract1.pdf",
  },
  {
    id: 2,
    employee_id: 2,
    type: "HĐ không thời hạn",
    start_date: "2022-05-15",
    end_date: "2025-05-15",
    note: "",
    file_url: "contract2.pdf",
  },
];

const ContractDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [contract, setContract] = useState<any>(null);
  const [employeeName, setEmployeeName] = useState("");

  useEffect(() => {
    const c = mockContracts.find((c) => c.id === Number(id));
    if (c) {
      setContract(c);
      const emp = mockEmployees.find((e) => e.id === c.employee_id);
      setEmployeeName(emp ? emp.name : "Không xác định");
    }
  }, [id]);

  if (!contract) return <p>Đang tải dữ liệu...</p>;

  const isExpired = new Date(contract.end_date) < new Date();

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Chi tiết hợp đồng</h3>

      {/* CONTRACT CARD */}
      <div className="card p-4 shadow-sm border-0 mb-4">

        <h4 className="fw-bold">
          Hợp đồng của: {employeeName}
        </h4>

        <p>
          <strong>Loại hợp đồng:</strong> {contract.type}
        </p>

        <p>
          <strong>Ngày bắt đầu:</strong> {contract.start_date}
        </p>

        <p>
          <strong>Ngày kết thúc:</strong>{" "}
          <span className="fw-bold">{contract.end_date}</span>{" "}
          {isExpired ? (
            <span className="badge bg-danger ms-2">Hết hạn</span>
          ) : (
            <span className="badge bg-success ms-2">Còn hiệu lực</span>
          )}
        </p>

        {/* FILE LINK */}
        <p>
          <strong>File hợp đồng:</strong>{" "}
          <a href={contract.file_url} target="_blank" rel="noreferrer">
            📄 Xem file
          </a>
        </p>

        {/* NOTE */}
        {contract.note && (
          <p>
            <strong>Ghi chú:</strong> {contract.note}
          </p>
        )}

        {/* BUTTONS */}
        <div className="mt-3 d-flex gap-3">
          <button
            className="btn btn-warning"
            onClick={() => navigate(`/contracts/${contract.id}/edit`)}
          >
            ✏ Sửa
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => navigate("/contracts")}
          >
            ↩ Quay lại
          </button>
        </div>

      </div>
    </div>
  );
};

export default ContractDetail;
