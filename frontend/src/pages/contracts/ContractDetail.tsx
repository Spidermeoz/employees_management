import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiGet } from "../../api/client";

// Kiểu dữ liệu hợp đồng từ backend
type Contract = {
  id: number;
  contract_type: string;
  start_date: string;
  end_date?: string | null;
  note?: string | null;
  file_url?: string | null;
  employee: {
    id: number;
    full_name: string;
  };
};

const ContractDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load contract từ backend
  useEffect(() => {
    const fetchContract = async () => {
      try {
        const data = await apiGet<Contract>(`/contracts/${id}`);
        setContract(data);
      } catch (err) {
        console.error(err);
        setError("Không thể tải thông tin hợp đồng.");
      } finally {
        setLoading(false);
      }
    };

    fetchContract();
  }, [id]);

  if (loading) return <p className="m-3">Đang tải dữ liệu...</p>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;
  if (!contract) return <p className="m-3">Không tìm thấy hợp đồng.</p>;

  const isExpired =
    contract.end_date && new Date(contract.end_date) < new Date();

  const fileUrl = contract.file_url || "";

  // Xác định loại file
  const extension = fileUrl.split(".").pop()?.toLowerCase();

  const isPDF = extension === "pdf";
  const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(
    extension || ""
  );
  const isDoc = ["doc", "docx", "xlsx", "xls", "ppt", "pptx"].includes(
    extension || ""
  );

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Chi tiết hợp đồng</h3>

      <div className="card p-4 shadow-sm border-0 mb-4">
        <h4 className="fw-bold">Hợp đồng của: {contract.employee.full_name}</h4>

        <p>
          <strong>Loại hợp đồng:</strong> {contract.contract_type}
        </p>

        <p>
          <strong>Ngày bắt đầu:</strong> {contract.start_date}
        </p>

        <p>
          <strong>Ngày kết thúc:</strong> {contract.end_date || "—"}{" "}
          {contract.end_date &&
            (isExpired ? (
              <span className="badge bg-danger ms-2">Hết hạn</span>
            ) : (
              <span className="badge bg-success ms-2">Còn hiệu lực</span>
            ))}
        </p>

        {/* FILE PREVIEW */}
        <div className="preview-section mt-4">
          <strong>File hợp đồng:</strong>

          {!fileUrl ? (
            <p className="text-muted">Chưa có file hợp đồng</p>
          ) : (
            <>
              <div
                className="border rounded p-3 mt-2"
                style={{ background: "#fafafa" }}
              >
                {isPDF && (
                  <embed
                    src={fileUrl}
                    type="application/pdf"
                    width="100%"
                    height="550px"
                  />
                )}

                {isImage && (
                  <img
                    src={fileUrl}
                    alt="Contract File"
                    className="img-fluid rounded"
                  />
                )}

                {isDoc && (
                  <iframe
                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(
                      fileUrl
                    )}&embedded=true`}
                    width="100%"
                    height="550px"
                    style={{ border: "none" }}
                  />
                )}

                {!isPDF && !isImage && !isDoc && (
                  <p className="text-muted">
                    Không thể preview loại file này. <br />
                    <a href={fileUrl} target="_blank" rel="noreferrer">
                      📄 Tải xuống / mở file
                    </a>
                  </p>
                )}
              </div>

              {/* Nút download */}
              <a
                href={fileUrl}
                download
                className="btn btn-outline-primary mt-3"
              >
                ⬇ Tải file hợp đồng
              </a>
            </>
          )}
        </div>

        {/* NOTE */}
        {contract.note && (
          <p className="mt-3">
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
