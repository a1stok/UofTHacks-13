import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("dashboard", "routes/dashboard.tsx", [
    // Default to setup
    index("routes/dashboard/setup.tsx"),
    // Website Generator routes
    route("generator", "routes/dashboard/generator/index.tsx"),
    route("generator/templates", "routes/dashboard/generator/templates.tsx"),
    route("generator/ai-generated", "routes/dashboard/generator/ai-generated.tsx"),
    route("generator/manual", "routes/dashboard/generator/manual.tsx"),
    // A/B Testing routes  
    route("experiments", "routes/dashboard/experiments/index.tsx"),
    route("experiments/ab-testing", "routes/dashboard/experiments/ab-testing.tsx"),
    route("experiments/paired-overview", "routes/dashboard/experiments/paired-overview.tsx"),
    route("experiments/user-flows", "routes/dashboard/experiments/user-flows.tsx"),
  ]),
] satisfies RouteConfig;
