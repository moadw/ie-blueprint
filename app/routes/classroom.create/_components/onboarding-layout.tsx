import type { ReactNode } from "react";
import glassBackground from "~/assets/glass-background.webp";
import { Logo } from "~/components/ui/logo";
import { cn } from "~/lib/utils";

export interface OnboardingLayoutProps {
  title: string;
  currentStep: number;
  totalSteps: number;
  children: ReactNode;
  preview?: ReactNode;
}

export function OnboardingLayout({
  title,
  currentStep,
  totalSteps,
  children,
  preview,
}: OnboardingLayoutProps) {
  return (
    <div className="relative h-screen overflow-hidden">
      <img
        src={glassBackground}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-card/30" />

      <div className="relative grid grid-cols-1 lg:grid-cols-2 h-full">
        <div className="flex flex-col h-full">
          <header className="px-6 sm:px-10 lg:px-14 pt-6 lg:pt-8">
            <Logo className="h-9" />
          </header>
          <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-14">
            <div className="w-full max-w-lg mx-auto lg:mx-0">
              <div className="flex gap-2 mb-3 lg:mb-4">
                {Array.from({ length: totalSteps }).map((_, i) => {
                  const active = i + 1 <= currentStep;
                  return (
                    <span
                      key={i}
                      className={cn(
                        "w-2.5 h-2.5 rounded-full transition-colors",
                        active ? "bg-primary" : "bg-primary/30",
                      )}
                    />
                  );
                })}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-foreground mb-6">
                {title}
              </h1>
              {children}
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-center px-14">
          {preview}
        </div>
      </div>
    </div>
  );
}
