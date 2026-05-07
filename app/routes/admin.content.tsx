import { Outlet } from "react-router";
import { AdminContentTabs } from "~/components/layout/admin-content-tabs";

export default function AdminContentLayout() {
  return (
    <div className="space-y-6">
      <AdminContentTabs />
      <Outlet />
    </div>
  );
}
