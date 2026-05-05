import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ie" },
    { name: "description", content: "ie" },
  ];
}

export default function Home() {
  return <main className="min-h-screen p-8 text-2xl font-semibold">ie</main>;
}
