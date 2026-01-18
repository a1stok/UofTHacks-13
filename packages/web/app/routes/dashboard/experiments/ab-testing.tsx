import { Navigate } from "react-router";
import type { Route } from "./+types/ab-testing";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "A/B Testing - Experiments" },
    { name: "description", content: "Create and manage A/B tests" },
  ];
}

export default function ABTestingView() {
  return <Navigate to="/dashboard/experiments/paired-overview" replace />;
}
