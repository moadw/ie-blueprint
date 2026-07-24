import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { resolveDistrictAdmin } from "~/lib/district-admin.server";

/**
 * `/district/admin` has no page of its own — it's always a redirect. For a
 * `district-admin` (or master-admin preview) that's the existing Schools/Users
 * sub-tabs. For a `school-admin` there IS no Schools/Users tab (see step-4 —
 * they never reach `/district/admin/schools`); their "Admin" tab lands
 * directly on their own school's detail view instead.
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const result = await resolveDistrictAdmin(request);
  if (result.role === "school-admin") {
    const firstSchoolId = result.schoolIds?.[0];
    if (firstSchoolId) {
      throw redirect(`/district/school/${firstSchoolId}`);
    }
    // Soft-failed scope resolution (e.g. "No schools assigned.") — there's no
    // school to land on and no Schools/Users tabs to fall back to for this
    // role. Degrade to the home shell rather than a dead redirect loop; the
    // layout loader will have already produced/left an error state there.
    throw redirect("/district/home");
  }
  throw redirect("/district/admin/schools");
}

export default function DistrictAdminIndexRoute() {
  return null;
}
