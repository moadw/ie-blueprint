import type { ReactNode } from "react";
import heroUrl from "~/assets/login-hero.webp";
import { Logo } from "~/components/ui/logo";

export interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex">
        {/* Left - Form column */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 lg:px-16">
          <div className="w-full max-w-[400px]">
            <Logo className="h-9 mb-8" />
            <h1 className="font-serif italic text-[42px] leading-tight mb-3 text-foreground">
              {title}
            </h1>
            <p className="text-muted-foreground text-[15px] mb-8">{subtitle}</p>
            {children}
          </div>
        </div>

        {/* Right - Hero panel (desktop only) */}
        <div className="hidden lg:block lg:w-[55%] p-4">
          <div className="relative w-full h-full rounded-3xl overflow-hidden">
            <img
              src={heroUrl}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-12 left-12 right-12">
              <h2 className="text-white text-[40px] leading-[1.15]">
                <span className="font-sans font-normal">Just</span>
                <br />
                <span className="font-serif italic">Press Play</span>
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
