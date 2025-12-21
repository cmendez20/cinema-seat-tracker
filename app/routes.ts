import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("save-new-seat", "routes/save-new-seat.tsx"),
  route("theaters/:theaterId/my-seats", "routes/theater-info.tsx"),
  route("new-user", "routes/new-user.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
] satisfies RouteConfig;
