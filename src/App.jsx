import React from "react";
import "./index.css";
import Display from "./components/display/display-component";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DisplayProvider } from "./context/DisplayContext";
import AnalyticsDashboard from "./components/analytics/AnalyticsDashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <DisplayProvider>
        <Display />
      </DisplayProvider>
    ),
  },
  {
    path: "/evaluation",
    element: (
      <AnalyticsDashboard />
    ),
  },
]);

const App = () => {
  return (
    // <div><InactivityTimeout /><Display /></div>
    <RouterProvider router={router} />
  );
};

export default App;
