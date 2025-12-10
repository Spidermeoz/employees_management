import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { apiGet, apiPost } from "../../api/client";
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

// ================= TYPES =================
type Employee = {
  id: number;
  full_name: string;
  salary_grade?: {
    id: number;
    grade_name: string;
    base_salary: number;
  } | null;
};

type RewardItem = {
  id: number;
  type: "reward" | "discipline";
  amount: number;
};

type FormErrors = {
  employee_id?: string;
  month?: string;
  year?: string;
  base_salary?: string;
};

// =========================================

const PayrollCreate: React.FC = () => {
  const navigate = useNavigate();

  // ========== DEFAULT MONTH (previous month) ==========
  const now = new Date();
  let defaultMonth = now.getMonth();
  let defaultYear = now.getFullYear();
  if (defaultMonth === 0) {
    defaultMonth = 12;
    defaultYear -= 1;
  }

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [rewardTotal, setRewardTotal] = useState(0);
  const [penaltyTotal, setPenaltyTotal] = useState(0);
  const [loadingRewards, setLoadingRewards] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    employee_id: "",
    month: String(defaultMonth),
    year: String(defaultYear),
    base_salary: "",
    allowance: "",
    bonus: "0",
    penalty: "0",
  });

  // ===== Load employee list =====
  useEffect(() => {
    apiGet<Employee[]>("/employees")
      .then(setEmployees)
      .catch(() => alert("Không thể tải danh sách nhân viên"));
  }, []);

  // ===== When selecting employee =====
  const handleEmployeeChange = async (e: any) => {
    const id = e.target.value;
    setForm({ ...form, employee_id: id });

    if (id) setErrors({ ...errors, employee_id: undefined });

    if (!id) return;

    // ==============================
    // 1) AUTO-FILL BASE SALARY
    // ==============================
    const emp = employees.find((e) => e.id === Number(id));

    if (emp?.salary_grade?.base_salary) {
      setForm((prev) => ({
        ...prev,
        base_salary: String(emp.salary_grade!.base_salary),
      }));
    }

    // ==============================
    // 2) AUTO REWARDS / PENALTIES
    // ==============================
    setLoadingRewards(true);

    try {
      const rewards = await apiGet<RewardItem[]>(`/rewards?employee_id=${id}`);

      const rewardSum = rewards
        .filter((r) => r.type === "reward")
        .reduce((sum, r) => sum + Number(r.amount), 0);

      const penaltySum = rewards
        .filter((r) => r.type === "discipline")
        .reduce((sum, r) => sum + Number(r.amount), 0);

      setRewardTotal(rewardSum);
      setPenaltyTotal(penaltySum);

      setForm((prev) => ({
        ...prev,
        bonus: String(rewardSum),
        penalty: String(penaltySum),
      }));
    } catch (err) {
      console.error(err);
      alert("Không thể tải dữ liệu thưởng/phạt.");
    } finally {
      setLoadingRewards(false);
    }
  };

  const change = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (value && errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.employee_id) newErrors.employee_id = "Vui lòng chọn nhân viên";
    if (!form.month || Number(form.month) < 1 || Number(form.month) > 12)
      newErrors.month = "Tháng phải từ 1 đến 12";
    if (!form.year || Number(form.year) < 2000 || Number(form.year) > 2100)
      newErrors.year = "Năm phải từ 2000 đến 2100";
    if (!form.base_salary || Number(form.base_salary) < 0)
      newErrors.base_salary = "Lương cơ bản không hợp lệ";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

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
          Number(form.base_salary) +
          Number(form.allowance || 0) +
          Number(form.bonus || 0) -
          Number(form.penalty || 0),
      };

      await apiPost("/payrolls", payload);
      alert("Tạo bảng lương thành công!");
      navigate("/payrolls");
    } catch (err) {
      console.error(err);
      alert("Không thể tạo bảng lương.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h3 className="fw-bold mb-0">Tạo bảng lương</h3>
        </div>

        <div className="card-body">
          <form onSubmit={submit}>
            <div className="row g-3">
              {/* ########## EMPLOYEE ########## */}
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
                  <option value="">-- Chọn nhân viên --</option>
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
                    <FaInfoCircle /> Đang tải thưởng/phạt...
                  </small>
                )}
              </div>

              {/* ########## MONTH ########## */}
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

              {/* ########## YEAR ########## */}
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

              {/* ########## BASE SALARY ########## */}
              <div className="col-md-6">
                <label className="form-label fw-bold">
                  <FaMoneyBillWave className="me-1" /> Lương cơ bản{" "}
                  <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <input
                    type="number"
                    name="base_salary"
                    min="0"
                    className={`form-control ${
                      errors.base_salary ? "is-invalid" : ""
                    }`}
                    value={form.base_salary}
                    onChange={change}
                    placeholder="Tự động điền theo bậc lương"
                  />
                  <span className="input-group-text">₫</span>
                </div>
                {errors.base_salary && (
                  <div className="invalid-feedback">{errors.base_salary}</div>
                )}
              </div>

              {/* ########## ALLOWANCE ########## */}
              <div className="col-md-6">
                <label className="form-label fw-bold">Phụ cấp</label>
                <div className="input-group">
                  <input
                    type="number"
                    name="allowance"
                    min="0"
                    className="form-control"
                    value={form.allowance}
                    onChange={change}
                  />
                  <span className="input-group-text">₫</span>
                </div>
              </div>

              {/* ########## BONUS (AUTO) ########## */}
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

              {/* ########## PENALTY (AUTO) ########## */}
              <div className="col-md-6">
                <label className="form-label fw-bold">
                  <FaExclamationTriangle className="me-1" /> Phạt (tự động)
                </label>
                <div className="input-group">
                  <input
                    type="number"
                    name="penalty"
                    className="form-control bg-light"
                    value={form.penalty}
                    readOnly
                  />
                  <span className="input-group-text">₫</span>
                </div>
                <small className="text-danger d-block mt-1">
                  Tổng phạt: {penaltyTotal.toLocaleString("vi-VN")}₫
                </small>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="mt-4 d-flex gap-3 justify-content-end">
              <button
                className="btn btn-secondary px-4"
                onClick={() => navigate("/payrolls")}
                type="button"
              >
                <FaTimes className="me-1" /> Huỷ
              </button>

              <button
                className="btn btn-primary px-4"
                type="submit"
                disabled={isSubmitting}
              >
                <FaSave className="me-1" />{" "}
                {isSubmitting ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PayrollCreate;
