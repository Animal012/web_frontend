export const ROUTES = {
    HOME: "/",
    SHIPS: "/ships",
    MODER_SHIPS: "/moderator-ships",
  }
  export type RouteKeyType = keyof typeof ROUTES;
  export const ROUTE_LABELS: {[key in RouteKeyType]: string} = {
    HOME: "Главная",
    SHIPS: "Корабли",
    MODER_SHIPS: "Корабли",
  };