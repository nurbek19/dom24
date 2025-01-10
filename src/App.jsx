import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import CreateAdvertisement from "./pages/CreateAdvertisement";
import OwnerAdvertisementsList from "./pages/OwnerAdvertisementsList";


function App() {
  return (
    <div>
      <Outlet />
    </div>
  )
}

export default App
