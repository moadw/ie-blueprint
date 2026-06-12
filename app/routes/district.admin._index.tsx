import { redirect } from "react-router";

export async function loader() {
  throw redirect("/district/admin/schools");
}

export default function DistrictAdminIndexRoute() {
  return null;
}
