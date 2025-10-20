import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./pages/home/home.component").then((m) => m.HomeComponent),
  },

  {
    path: "login",
    loadComponent: () => import("./pages/login/login.component").then((m) => m.LoginComponent),
  },
  {
    path: "dashboard",
    loadComponent: () =>
      import("./pages/dashboard/dashboard.component").then((m) => m.DashboardComponent),
  },

  {
    path: "household",
    loadComponent: () =>
      import("./pages/household/household.component").then((m) => m.HouseholdComponent),
  },
  {
    path: "room/:id",
    loadComponent: () => import("./pages/room/room.component").then((m) => m.RoomComponent),
  },
  {
    path: "container/:containerId",
    loadComponent: () =>
      import("./pages/container/container.component").then((m) => m.ContainerComponent),
  },

  {
    path: "object/:id",
    loadComponent: () => import("./pages/object/object.component").then((m) => m.ObjectComponent),
  },
];
