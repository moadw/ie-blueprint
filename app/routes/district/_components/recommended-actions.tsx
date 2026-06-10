import type { ReactNode } from "react";
import { GraduationCap, Users, FileText, Settings } from "lucide-react";

interface ActionGroup {
  icon: ReactNode;
  title: string;
  period?: string;
  items: string[];
}

const GROUPS: ActionGroup[] = [
  {
    icon: <GraduationCap className="w-4 h-4 text-primary" />,
    title: "Teacher Training",
    period: "May – June",
    items: [
      "Conduct onboarding workshops for new teachers",
      "Share best practices guide for classroom usage",
      "Set up monthly check-ins with department leads",
    ],
  },
  {
    icon: <Users className="w-4 h-4 text-primary" />,
    title: "Parent Outreach",
    period: "July",
    items: [
      "Send parent engagement email with app overview",
      "Host a virtual demo night for families",
      "Create take-home practice guide",
    ],
  },
  {
    icon: <FileText className="w-4 h-4 text-primary" />,
    title: "Content Updates",
    period: "Permanent",
    items: [
      "Review and refresh seasonal practice series",
      "Add new SEL-aligned practices for middle school",
      "Audit unused content and archive low-engagement items",
    ],
  },
  {
    icon: <Settings className="w-4 h-4 text-primary" />,
    title: "Platform Optimization",
    items: [
      "Enable push notifications for daily reminders",
      "Configure analytics dashboards per school",
      "Set engagement targets for Q3",
    ],
  },
];

export function RecommendedActions() {
  return (
    <div className="bg-white rounded-[24px] border border-border shadow-xs p-4 flex flex-col h-full overflow-hidden">
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-foreground">
          Recommended Actions
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {GROUPS.map((group, gi) => (
          <div key={group.title}>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-[16px] bg-primary/10">
                {group.icon}
              </div>
              <span className="text-xs font-semibold text-foreground">
                {group.title}
              </span>
              {group.period ? (
                <span className="text-[10px] text-muted-foreground border border-border rounded-full px-2.5 py-0.5 ml-auto">
                  {group.period}
                </span>
              ) : null}
            </div>
            <ul className="space-y-1.5 pl-8">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2"
                >
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-muted-foreground/40 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            {gi < GROUPS.length - 1 ? (
              <div className="border-b border-border mt-4" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecommendedActions;
