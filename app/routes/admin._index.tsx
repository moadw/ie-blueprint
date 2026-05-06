import { redirect } from "react-router";

export async function loader() {
  throw redirect("/admin/content");
}

export default function AdminIndexRoute() {
  return null;
}
