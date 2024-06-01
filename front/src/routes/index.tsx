import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login, Participants } from "../pages";

export function RoutesApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/participantes" element={<Participants />} />
      </Routes>
    </BrowserRouter>
  );
}
