import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from "react-router-dom";
import Home from "./pages/Home";
import DetailPost from "./pages/DetailPost.JSX";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/trips/:id",
    element: <DetailPost />,
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
