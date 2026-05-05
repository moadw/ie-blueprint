import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ie" },
    { name: "description", content: "ie" },
  ];
}

export default function Home() {
  return <main>ie</main>;
}
