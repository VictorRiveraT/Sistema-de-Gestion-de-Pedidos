import { createBrowserRouter, Navigate } from "react-router";
import { ClientView } from "./components/ClientView";
import { AdminView } from "./components/AdminView";
import { DeliveryView } from "./components/DeliveryView";
import { Layout } from "./components/Layout";
import { Login } from "./components/Login";
import { SignUp } from "./components/SignUp";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: SignUp,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute allowedRoles={['cliente']}>
            <ClientView />
          </ProtectedRoute>
        )
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminView />
          </ProtectedRoute>
        )
      },
      {
        path: "repartidor",
        element: (
          <ProtectedRoute allowedRoles={['repartidor']}>
            <DeliveryView />
          </ProtectedRoute>
        )
      },
    ],
  },
]);