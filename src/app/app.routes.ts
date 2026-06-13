import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./components/splash/splash.component").then((m) => m.SplashComponent),
  },

  {
    path: "login",
    loadComponent: () => import("./components/login/login.component").then((m) => m.LoginComponent),
  },
  {
    path: "register",
    loadComponent: () => import("./components/register/register.component").then((m) => m.RegisterComponent),
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
    path: "room/edit/:id",
    loadComponent: () => import("./components/room-edit/room-edit.component").then((m) => m.RoomEditComponent),
  },
  {
    path: "container/:containerId",
    loadComponent: () =>
      import("./components/container/container.component").then((m) => m.ContainerComponent),
  },
  {
    path: "container/edit/:containerId",
    loadComponent: () =>
      import("./components/container-edit/container-edit.component").then((m) => m.ContainerEditComponent),
  },
  {
    path: "object/:id",
    loadComponent: () =>
      import("./components/object/object.component").then((m) => m.ObjectComponent),
  },
  {
    path: "object/edit/:id",
    loadComponent: () => import("./components/object-edit/object-edit.component").then((m) => m.ObjectEditComponent),
  }
];
