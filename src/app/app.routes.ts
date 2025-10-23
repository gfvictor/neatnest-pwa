import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./components/home/home.component").then((m) => m.HomeComponent),
  },

  {
    path: "login",
    loadComponent: () => import("./components/login/login.component").then((m) => m.LoginComponent),
  },
  {
    path: "dashboard",
    loadComponent: () =>
      import("./components/dashboard/dashboard.component").then((m) => m.DashboardComponent),
  },

  {
    path: "household",
    loadComponent: () =>
      import("./components/household/household.component").then((m) => m.HouseholdComponent),
  },
  {
    path: "room/:id",
    loadComponent: () => import("./components/room/room.component").then((m) => m.RoomComponent),
  },
  {
    path: "container/:containerId",
    loadComponent: () =>
      import("./components/container/container.component").then((m) => m.ContainerComponent),
  },

  {
    path: "object/:id",
    loadComponent: () =>
      import("./components/object/object.component").then((m) => m.ObjectComponent),
  },
];
