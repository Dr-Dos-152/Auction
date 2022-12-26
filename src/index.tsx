import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom"
import "./index.css"
import ErrorPage from "./components/ErrorPage"
import Home from "./components/home/Home"
import CreateListing from "./components/CreateListings"
import AuctionDetail from "./components/AuctionDetail"
import Profile from "./components/Profile"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/create-listing",
        element: <CreateListing />,
      },
      {
        path: "/auction/:auctionId",
        element: <AuctionDetail />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
])

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
