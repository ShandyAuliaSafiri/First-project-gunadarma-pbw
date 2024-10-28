import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
// import NotFound from "../component/NotFound";
// import MainLayout from "./pages/MainLayout";
import AddEditForm from "./pages/AddEditForm";
import Register from "./pages/Register";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
    loader: () => {
      if (localStorage.getItem("access_token")) {
        return redirect("/");
      }
      return null;
    },
  },
  {
    path: "/",
    element: <Home />,
    loader: () => {
      if (!localStorage.getItem("access_token")) {
        return redirect("/login");
      }
      return null;
    },
  },
  {
    path: "/add-edit",
    element: <AddEditForm />,
  },
  {
    path: "/add-edit/:id",
    element: <AddEditForm />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  // {
  //   path: "*",
  //   element: <NotFound />,
  // },
  // {
  //   element: <MainLayout />,
  //   children: [
  //     {
  //       path: "*",
  //       element: <NotFound />,
  //     },
  //   ],
  // },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
