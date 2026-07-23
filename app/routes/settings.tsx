import type { LoaderFunctionArgs } from "react-router";
import { Outlet, useLoaderData, useNavigate } from "react-router";
import { X } from "lucide-react";
import { gqlClient } from "~/lib/graphql";
import { safe } from "~/lib/safe-loader";
import { requireSessionToken } from "~/lib/session.server";
import { UsersFindOneDocument } from "~/queries/users";
import { SettingsSidebar } from "~/routes/settings/_components/settings-sidebar";
import { BottomFade } from "~/routes/settings/_components/bottom-fade";
import { getLastLocation, takeSettingsOrigin } from "~/lib/last-curriculum";
import glassBackground from "~/assets/glass-background.webp";

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await requireSessionToken(request);
  // Resolve the role so the modal can hide learner/progress surfaces from
  // district admins and return them to the portal (not /classrooms) on close.
  const result = await safe(
    gqlClient.request(UsersFindOneDocument, {}, { "access-token": token }),
  );
  const isDistrictAdmin = result.ok
    ? result.data.UsersFindOne?.typeObj?.identifier === "district-admin"
    : false;
  return { isDistrictAdmin };
}

export default function SettingsLayoutRoute() {
  const { isDistrictAdmin } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  // Close destination is origin-based, decoupled from role: whichever avatar
  // menu opened settings stamped a one-shot origin marker. "district" → back to
  // the portal; otherwise fall back to the last classroom curriculum (recorded
  // by the series route). `isDistrictAdmin` is only the last-resort default when
  // neither an origin marker nor a saved last-location exists.
  const close = () => {
    const origin = takeSettingsOrigin();
    if (origin === "district") {
      navigate("/district");
      return;
    }
    const last = getLastLocation();
    if (last) {
      navigate(`/classrooms/${last.groupId}/${last.curriculumId}`);
      return;
    }
    navigate(isDistrictAdmin ? "/district" : "/classrooms");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background image layer */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${glassBackground})` }}
      />

      {/* Backdrop — click to close */}
      <div
        className="absolute inset-0 bg-black/35 backdrop-blur-sm cursor-pointer"
        onClick={close}
      />

      {/* Settings card */}
      <div
        className="relative z-10 flex w-[95vw] max-w-6xl h-[90vh] max-h-[850px] rounded-[24px] overflow-hidden"
        style={{
          boxShadow:
            "0 25px 80px -12px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)",
        }}
      >
        <SettingsSidebar />

        {/* White content card */}
        <div className="flex-1 bg-white rounded-r-[24px] overflow-hidden relative">
          {/* Done button */}
          <button
            type="button"
            onClick={close}
            className="absolute top-6 right-6 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border text-foreground font-medium text-sm transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <span>Done</span>
            <X className="h-4 w-4" />
          </button>

          {/* Scroll area */}
          <div className="h-full overflow-y-auto p-8 pb-24">
            <Outlet />
          </div>

          <BottomFade />
        </div>
      </div>
    </div>
  );
}
