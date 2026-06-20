import { redirect } from "react-router";

export async function loader() {
  throw redirect("/settings/profile");
}

export default function SettingsIndexRoute() {
  return null;
}
