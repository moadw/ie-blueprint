import { ExternalLink, HelpCircle, Mail, MessageCircle } from "lucide-react";

import { SectionHeader } from "~/routes/settings/_components/section-header";

export default function SettingsGetHelpRoute() {
  return (
    <div className="max-w-2xl">
      <SectionHeader
        title="Get Help"
        subtitle="Find answers and get support for your Inner Explorer experience."
      />

      <div className="space-y-3">
        <a
          href="mailto:info@innerexplorer.com"
          className="flex items-center gap-4 p-4 rounded-xl border border-border transition-colors hover:bg-muted/50"
        >
          <div className="w-10 h-10 rounded-[16px] bg-muted flex items-center justify-center">
            <Mail className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">Email Support</p>
            <p className="text-sm text-muted-foreground">
              info@innerexplorer.com
            </p>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </a>

        <a
          href="https://innerexplorer.com/faq"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-4 p-4 rounded-xl border border-border transition-colors hover:bg-muted/50"
        >
          <div className="w-10 h-10 rounded-[16px] bg-muted flex items-center justify-center">
            <HelpCircle className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">FAQ & Knowledge Base</p>
            <p className="text-sm text-muted-foreground">
              Find answers to common questions
            </p>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </a>

        <a
          href="https://innerexplorer.com/contact"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-4 p-4 rounded-xl border border-border transition-colors hover:bg-muted/50"
        >
          <div className="w-10 h-10 rounded-[16px] bg-muted flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">Contact Us</p>
            <p className="text-sm text-muted-foreground">
              Get in touch with our team
            </p>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </a>
      </div>
    </div>
  );
}
