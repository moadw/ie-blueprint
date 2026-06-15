import { Calendar, CreditCard, Mail, Phone, Shield } from "lucide-react";

import { SectionHeader } from "~/routes/settings/_components/section-header";
import { profileFixture } from "~/routes/settings/_fixtures";

export default function SettingsProfileRoute() {
  const profile = profileFixture;
  const initial = profile.displayName.charAt(0).toUpperCase();

  return (
    <div className="max-w-2xl">
      <SectionHeader
        title="Manage Profile"
        subtitle="View your account information and subscription details."
      />

      <div className="space-y-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-[24px]">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border">
            <span className="text-xl font-medium text-muted-foreground">
              {initial}
            </span>
          </div>
          <div>
            <p className="font-medium text-foreground text-lg">
              {profile.displayName}
            </p>
            <p className="text-sm text-muted-foreground">
              Member since {profile.memberSince}
            </p>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-muted/30 rounded-[24px] p-6">
          <h3 className="text-sm font-semibold text-foreground mb-5 flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            Basic Information
          </h3>

          <div className="space-y-5">
            {/* Email */}
            <div className="flex items-start justify-between">
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wide">
                  Email
                </label>
                <p className="text-foreground mt-1 font-medium">
                  {profile.email}
                </p>
              </div>
              <a
                href="#"
                className="text-xs text-primary hover:underline font-medium"
              >
                Verify Email
              </a>
            </div>

            {/* Country */}
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide">
                Country
              </label>
              <p className="text-foreground mt-1">{profile.country}</p>
            </div>

            {/* Phone Number */}
            <div className="flex items-start justify-between">
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                  <Phone className="w-3 h-3" />
                  Phone Number
                </label>
                <p className="text-muted-foreground mt-1 italic">
                  {profile.phone}
                </p>
              </div>
              <a
                href="#"
                className="text-xs text-primary hover:underline font-medium"
              >
                Verify Number
              </a>
            </div>
          </div>
        </div>

        {/* Subscription Details */}
        <div className="bg-muted/30 rounded-[24px] p-6">
          <h3 className="text-sm font-semibold text-foreground mb-5 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-muted-foreground" />
            Subscription Details
          </h3>

          <div className="grid grid-cols-2 gap-5">
            {/* Start Date */}
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                Subscription Start Date
              </label>
              <p className="text-foreground mt-1 font-medium">
                {profile.subscriptionStart}
              </p>
            </div>

            {/* End Date */}
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                Subscription End Date
              </label>
              <p className="text-foreground mt-1 font-medium">
                {profile.subscriptionEnd ?? "No expiration"}
              </p>
            </div>

            {/* Subscription Type */}
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide">
                Subscription Type
              </label>
              <p className="text-foreground mt-1 font-medium">
                {profile.subscriptionType}
              </p>
            </div>

            {/* Admin Email */}
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                <Shield className="w-3 h-3" />
                Admin Email
              </label>
              <p className="text-foreground mt-1 font-medium">
                {profile.adminEmail}
              </p>
            </div>
          </div>
        </div>

        {/* Account Status */}
        <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-foreground">
            Account active •{" "}
            {profile.hasPremiumAccess ? "Premium access enabled" : "Trial access"}
          </span>
        </div>
      </div>
    </div>
  );
}
