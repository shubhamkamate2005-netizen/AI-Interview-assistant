import { createBrowserRouter } from "react-router-dom";

import Login from "./features/auth/pages/Login.jsx";
import Register from "./features/auth/pages/Register.jsx";
import Protected from "./features/auth/components/Protected.jsx";
import Dashboard from "./features/interview/pages/Dashboard.jsx";
import ReportPage from "./features/interview/pages/ReportPage.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Protected><Dashboard /></Protected>
  },
  {
    path: "/interview/:id",
    element: <Protected><ReportPage /></Protected>
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  }
]);
