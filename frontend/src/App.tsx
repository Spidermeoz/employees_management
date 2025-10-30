import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "./router";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Theme tổng */}
      <div className="min-h-screen bg-slate-50 text-slate-800">
        <RouterProvider router={router} />
      </div>
    </QueryClientProvider>
  );
}
