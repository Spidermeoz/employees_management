import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiGet } from "../../api/client";
import {
  FaFileContract,
  FaEdit,
  FaArrowLeft,
  FaUser,
  FaCalendarAlt,
  FaFilePdf,
  FaFileImage,
  FaFileWord,
  FaFileExcel,
  FaRegFile,
  FaDownload,
} from "react-icons/fa";

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

  if (loading) return <p className="m-3 text-center">Đang tải dữ liệu...</p>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;
  if (!contract)
    return <p className="m-3 text-danger">Không tìm thấy hợp đồng.</p>;

  const isExpired =
    contract.end_date && new Date(contract.end_date) < new Date();
  const fileUrl = contract.file_url || "";
  const extension = fileUrl.split(".").pop()?.toLowerCase();

  const isPDF = extension === "pdf";
  const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(
    extension || ""
  );
  // Thêm biến isDoc để xác định các loại file văn phòng
  const isDoc = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(
    extension || ""
  );

  const getFileIcon = () => {
    if (isPDF) return <FaFilePdf className="me-2 text-danger" />;
    if (isImage) return <FaFileImage className="me-2 text-success" />;
    if (extension === "doc" || extension === "docx")
      return <FaFileWord className="me-2 text-primary" />;
    if (extension === "xls" || extension === "xlsx")
      return <FaFileExcel className="me-2 text-success" />;
    return <FaRegFile className="me-2 text-secondary" />;
  };

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h3 className="fw-bold mb-0">
            <FaFileContract className="me-2" />
            Chi tiết hợp đồng
          </h3>
        </div>
        <div className="card-body">
          <div className="card mb-4">
            <div className="card-body">
              <h4 className="fw-bold mb-1">
                {contract.employee.full_name} - {contract.contract_type}
              </h4>
              <p className="mb-0 text-muted">Mã hợp đồng: #{contract.id}</p>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="card mb-3">
                <div className="card-body">
                  <h5 className="fw-bold mb-3">
                    <FaUser className="me-2" />
                    Thông tin nhân viên
                  </h5>
                  <p className="mb-1">
                    <strong>Họ và tên:</strong> {contract.employee.full_name}
                  </p>
                  <p className="mb-0">
                    <strong>Mã nhân viên:</strong> #{contract.employee.id}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card mb-3">
                <div className="card-body">
                  <h5 className="fw-bold mb-3">
                    <FaCalendarAlt className="me-2" />
                    Thông tin hợp đồng
                  </h5>
                  <p className="mb-1">
                    <strong>Loại hợp đồng:</strong> {contract.contract_type}
                  </p>
                  <p className="mb-1">
                    <strong>Ngày bắt đầu:</strong> {contract.start_date}
                  </p>
                  <p className="mb-1">
                    <strong>Ngày kết thúc:</strong> {contract.end_date || "—"}
                  </p>
                  <p className="mb-0">
                    <strong>Trạng thái:</strong>{" "}
                    <span
                      className={`badge ${
                        isExpired ? "bg-danger" : "bg-success"
                      }`}
                    >
                      {isExpired ? "Hết hạn" : "Còn hiệu lực"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {contract.note && (
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="fw-bold mb-2">Ghi chú</h5>
                <p className="mb-0">{contract.note}</p>
              </div>
            </div>
          )}

          <div className="card">
            <div className="card-body">
              <h5 className="fw-bold mb-3">{getFileIcon()}File hợp đồng</h5>
              {!fileUrl ? (
                <p className="text-muted mb-0">Chưa có file đính kèm.</p>
              ) : (
                <>
                  {/* 🔥 SỬ DỤNG <embed> CHO PDF */}
                  {isPDF && (
                    <embed
                      src={fileUrl}
                      type="application/pdf"
                      width="100%"
                      height="600px"
                      title="Contract PDF"
                    />
                  )}

                  {isImage && (
                    <img
                      src={fileUrl}
                      alt="Contract File"
                      className="img-fluid rounded"
                      style={{ maxHeight: "600px", objectFit: "contain" }}
                    />
                  )}

                  {/* 🔥 THÊM GOOGLE DOCS VIEWER CHO CÁC LOẠI FILE KHÁC */}
                  {isDoc && (
                    <iframe
                      src={`https://docs.google.com/viewer?url=${encodeURIComponent(
                        fileUrl
                      )}&embedded=true`}
                      width="100%"
                      height="600px"
                      title="Contract Document"
                      style={{ border: "1px solid #ddd", borderRadius: "4px" }}
                    />
                  )}

                  {!isPDF && !isImage && !isDoc && (
                    <div className="text-center p-4">
                      <h4>Không thể xem trước loại file này.</h4>
                      <p className="text-muted">
                        Vui lòng tải xuống để xem nội dung.
                      </p>
                    </div>
                  )}
                  <div className="mt-3">
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      <FaDownload className="me-1" /> Tải xuống
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-4 d-flex justify-content-end gap-2">
            <button
              className="btn btn-warning px-4"
              onClick={() => navigate(`/contracts/${contract.id}/edit`)}
            >
              <FaEdit className="me-1" /> Sửa
            </button>
            <button
              className="btn btn-secondary px-4"
              onClick={() => navigate("/contracts")}
            >
              <FaArrowLeft className="me-1" /> Quay lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDetail;
