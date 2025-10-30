import { useState, useMemo } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users2,
  Building2,
  UserCircle2,
  LogOut,
  Menu,
  X,
  Search,
} from "lucide-react";

function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const navItems = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/employees", label: "Nhân viên", icon: Users2 },
  { to: "/app/departments", label: "Phòng ban", icon: Building2 },
  { to: "/app/profile", label: "Hồ sơ", icon: UserCircle2 },
];

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = useMemo(() => ({ username: "admin", role: "Admin" }), []);
  const logout = () => navigate("/", { replace: true });

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 text-slate-800">
      {/* ===== Sidebar ===== */}
      <aside
        className={cx(
          "fixed inset-y-0 left-0 z-40 w-64 flex-shrink-0 transform border-r border-slate-200 bg-white transition-transform md:static md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo + Close */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
          <div
            className="cursor-pointer select-none rounded-lg bg-slate-900 px-3 py-1 text-sm font-semibold text-white"
            onClick={() => navigate("/app/dashboard")}
          >
            EMP MANAGER
          </div>
          <button
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Đóng sidebar"
          >
            <X className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.to);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={cx(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all",
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-700 hover:bg-slate-100"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t px-4 py-4 text-xs text-slate-600">
          <p className="font-semibold text-slate-800 mb-1">Mẹo sử dụng</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>
              Nhấn <kbd className="rounded bg-slate-200 px-1">/</kbd> để tìm
              nhanh
            </li>
            <li>Dùng thanh bên để điều hướng</li>
          </ul>
        </div>
      </aside>

      {/* ===== Main Area ===== */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            {/* Nút mở sidebar (mobile) */}
            <button
              className="inline-flex items-center justify-center rounded-lg p-2 hover:bg-slate-100 md:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Mở sidebar"
            >
              <Menu className="h-5 w-5 text-slate-600" />
            </button>

            {/* Ô tìm kiếm */}
            <div className="hidden md:flex w-72 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                placeholder="Tìm kiếm nhanh..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* User */}
          <div className="flex items-center gap-3">
            <div className="hidden text-right md:block">
              <div className="text-sm font-medium leading-5">
                {user.username}
              </div>
              <div className="text-xs text-slate-500">{user.role}</div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
              {user.username[0].toUpperCase()}
            </div>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm min-h-[calc(100vh-8rem)]">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}
    </div>
  );
}
