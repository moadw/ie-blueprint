import { Toaster as SonnerToaster } from "sonner";

// Wrapper to keep our import surface project-local. The Toaster is already
// mounted in app/root.tsx; this component exists for symmetry with the rest
// of the primitives folder and for future style theming.
export function Toaster() {
  return <SonnerToaster richColors position="top-center" />;
}
