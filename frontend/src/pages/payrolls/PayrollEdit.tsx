import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiGet, apiPut } from "../../api/client";
import {
  FaUser,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaGift,
  FaExclamationTriangle,
  FaSave,
  FaTimes,
  FaInfoCircle,
  FaList,
} from "react-icons/fa";

// Kiểu dữ liệu
type Employee = {
  id: number;
  full_name: string;
};

type RewardItem = {
  id: number;
  type: "reward" | "discipline";
  amount: number;
};

type Payroll = {
  id: number;
  employee_id: number;
  month: number;
  year: number;
  base_salary: number;
  allowance: number;
  bonus: number;
  penalty: number;
};

// Kiểu lỗi validate
type FormErrors = {
  employee_id?: string;
  month?: string;
  year?: string;
  allowance?: string;
};

const PayrollEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // lấy payroll id từ URL

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [form, setForm] = useState<Payroll | null>(null);

  const [rewardTotal, setRewardTotal] = useState(0);
  const [penaltyTotal, setPenaltyTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [loadingRewards, setLoadingRewards] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // === Load payroll hiện tại + employee list ===
  useEffect(() => {
    const loadData = async () => {
      try {
        const [payrollData, employeeData] = await Promise.all([
          apiGet<Payroll>(`/payrolls/${id}`),
          apiGet<Employee[]>(`/employees`),
        ]);

        setForm(payrollData);
        setEmployees(employeeData);

        // load thưởng/phạt ban đầu
        if (payrollData.employee_id) {
          fetchRewards(payrollData.employee_id);
        }
      } catch (err) {
        console.error(err);
        alert("Không thể tải dữ liệu bảng lương.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // === Hàm tải thưởng & phạt ===
  const fetchRewards = async (employeeId: number) => {
    setLoadingRewards(true);

    try {
      const rewards = await apiGet<RewardItem[]>(
        `/rewards?employee_id=${employeeId}`
      );

      const rewardSum = rewards
        .filter((r) => r.type === "reward")
        .reduce((sum, r) => sum + Number(r.amount), 0);

      const penaltySum = rewards
        .filter((r) => r.type === "discipline")
        .reduce((sum, r) => sum + Number(r.amount), 0);

      setRewardTotal(rewardSum);
      setPenaltyTotal(penaltySum);

      // tự động fill vào form
      setForm((prev) =>
        prev
          ? {
              ...prev,
              bonus: rewardSum,
              penalty: penaltySum,
            }
          : prev
      );
    } catch (err) {
      console.error(err);
      alert("Không thể tải dữ liệu thưởng/phạt.");
    } finally {
      setLoadingRewards(false);
    }
  };

  // === Khi đổi nhân viên ===
  const handleEmployeeChange = (e: any) => {
    const employeeId = Number(e.target.value);

    setForm((prev) =>
      prev
        ? {
            ...prev,
            employee_id: employeeId,
          }
        : prev
    );

    // Xóa lỗi khi người dùng đã chọn
    if (employeeId) {
      setErrors({ ...errors, employee_id: undefined });
    }

    if (employeeId) {
      fetchRewards(employeeId);
    }
  };

  const change = (e: any) => {
    if (!form) return;

    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });

    // Xóa lỗi khi người dùng đã nhập
    if (value && errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  // Hàm validate form
  const validateForm = (): boolean => {
    if (!form) return false;

    const newErrors: FormErrors = {};

    if (!form.employee_id) {
      newErrors.employee_id = "Vui lòng chọn nhân viên";
    }

    if (!form.month || Number(form.month) < 1 || Number(form.month) > 12) {
      newErrors.month = "Tháng phải từ 1 đến 12";
    }

    if (!form.year || Number(form.year) < 2000 || Number(form.year) > 2100) {
      newErrors.year = "Năm phải từ 2000 đến 2100";
    }

    if (form.allowance && Number(form.allowance) < 0) {
      newErrors.allowance = "Phụ cấp phải lớn hơn hoặc bằng 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // === Submit cập nhật payroll ===
  const submit = async (e: any) => {
    e.preventDefault();
    if (!form) return;

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        employee_id: Number(form.employee_id),
        month: Number(form.month),
        year: Number(form.year),
        base_salary: Number(form.base_salary),
        allowance: Number(form.allowance || 0),
        bonus: Number(form.bonus || 0),
        penalty: Number(form.penalty || 0),
        total_salary:
          Number(form.base_salary || 0) +
          Number(form.allowance || 0) +
          Number(form.bonus || 0) -
          Number(form.penalty || 0),
      };

      await apiPut(`/payrolls/${id}`, payload);

      alert("Cập nhật bảng lương thành công!");
      navigate("/payrolls");
    } catch (err) {
      console.error(err);
      alert("Không thể cập nhật bảng lương.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !form)
    return <p className="m-3 text-center">Đang tải dữ liệu...</p>;

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h3 className="fw-bold mb-0">Chỉnh sửa bảng lương</h3>
        </div>
        <div className="card-body">
          <form onSubmit={submit}>
            <div className="row g-3">
              {/* Nhân viên */}
              <div className="col-md-6">
                <label className="form-label fw-bold">
                  <FaUser className="me-1" /> Nhân viên{" "}
                  <span className="text-danger">*</span>
                </label>
                <select
                  name="employee_id"
                  className={`form-select ${
                    errors.employee_id ? "is-invalid" : ""
                  }`}
                  value={form.employee_id}
                  onChange={handleEmployeeChange}
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.full_name}
                    </option>
                  ))}
                </select>
                {errors.employee_id && (
                  <div className="invalid-feedback">{errors.employee_id}</div>
                )}
                {loadingRewards && (
                  <small className="text-muted">
                    <FaInfoCircle className="me-1" />
                    Đang tải dữ liệu thưởng/phạt...
                  </small>
                )}
              </div>

              {/* Tháng */}
              <div className="col-md-3">
                <label className="form-label fw-bold">
                  <FaCalendarAlt className="me-1" /> Tháng{" "}
                  <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  name="month"
                  min="1"
                  max="12"
                  className={`form-control ${errors.month ? "is-invalid" : ""}`}
                  value={form.month}
                  onChange={change}
                />
                {errors.month && (
                  <div className="invalid-feedback">{errors.month}</div>
                )}
              </div>

              {/* Năm */}
              <div className="col-md-3">
                <label className="form-label fw-bold">
                  <FaCalendarAlt className="me-1" /> Năm{" "}
                  <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  name="year"
                  min="2000"
                  max="2100"
                  className={`form-control ${errors.year ? "is-invalid" : ""}`}
                  value={form.year}
                  onChange={change}
                />
                {errors.year && (
                  <div className="invalid-feedback">{errors.year}</div>
                )}
              </div>

              {/* Lương cơ bản (chỉ đọc) */}
              <div className="col-md-6">
                <label className="form-label fw-bold">
                  <FaMoneyBillWave className="me-1" /> Lương cơ bản (không thể
                  chỉnh sửa)
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    name="base_salary"
                    className="form-control bg-light"
                    value={form.base_salary.toLocaleString("vi-VN")}
                    readOnly
                  />
                  <span className="input-group-text">₫</span>
                </div>
                <small className="text-muted">
                  <FaInfoCircle className="me-1" />
                  Lương cơ bản được định sẵn, không thể thay đổi
                </small>
              </div>

              {/* Phụ cấp */}
              <div className="col-md-6">
                <label className="form-label fw-bold">
                  <FaMoneyBillWave className="me-1" /> Phụ cấp
                </label>
                <div className="input-group">
                  <input
                    type="number"
                    name="allowance"
                    min="0"
                    className={`form-control ${
                      errors.allowance ? "is-invalid" : ""
                    }`}
                    value={form.allowance}
                    onChange={change}
                  />
                  <span className="input-group-text">₫</span>
                </div>
                {errors.allowance && (
                  <div className="invalid-feedback">{errors.allowance}</div>
                )}
              </div>

              {/* Thưởng/phạt auto */}
              <div className="col-md-6">
                <label className="form-label fw-bold">
                  <FaGift className="me-1" /> Thưởng (tự động)
                </label>
                <div className="input-group">
                  <input
                    type="number"
                    name="bonus"
                    className="form-control bg-light"
                    value={form.bonus}
                    readOnly
                  />
                  <span className="input-group-text">₫</span>
                </div>

                {/* BUTTON: REWARD LIST */}
                <button
                  className="btn btn-outline-primary mt-2 btn-sm"
                  disabled={!form.employee_id}
                  onClick={() =>
                    navigate(`/rewards?employee_id=${form.employee_id}`)
                  }
                  type="button"
                >
                  <FaList className="me-1" />
                  Xem thưởng / phạt
                </button>

                <small className="text-success d-block mt-1">
                  Tổng thưởng: {rewardTotal.toLocaleString("vi-VN")}₫
                </small>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold">
                  <FaExclamationTriangle className="me-1" /> Phạt (tự động)
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    name="penalty"
                    className="form-control bg-light"
                    value={form.penalty.toLocaleString("vi-VN")}
                    readOnly
                  />
                  <span className="input-group-text">₫</span>
                </div>
                <small className="text-danger">
                  <FaExclamationTriangle className="me-1" />
                  Tổng phạt: {penaltyTotal.toLocaleString("vi-VN")}₫
                </small>
              </div>
            </div>

            {/* BUTTON */}
            <div className="mt-4 d-flex gap-3 justify-content-end">
              <button
                className="btn btn-secondary px-4"
                type="button"
                onClick={() => navigate("/payrolls")}
              >
                <FaTimes className="me-1" /> Huỷ
              </button>
              <button
                className="btn btn-primary px-4"
                type="submit"
                disabled={isSubmitting}
              >
                <FaSave className="me-1" />
                {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PayrollEdit;
