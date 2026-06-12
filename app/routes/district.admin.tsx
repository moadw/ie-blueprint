import { Outlet } from "react-router";
import { DistrictAdminTabs } from "~/routes/district.admin/_components/district-admin-tabs";

export default function DistrictAdminLayoutRoute() {
  return (
    <div className="p-6 max-w-5xl mx-auto w-full space-y-4">
      <DistrictAdminTabs />
      <Outlet />
    </div>
  );
}
