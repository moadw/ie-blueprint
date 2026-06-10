import { redirect } from "react-router";

export async function loader() {
  throw redirect("/district/home");
}

export default function DistrictIndexRoute() {
  return null;
}
