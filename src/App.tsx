import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AppHeader } from "./components/AppHeader.tsx";
import { FavoritesPage } from "./pages/FavoritesPage.tsx";
import { HomePage } from "./pages/HomePage.tsx";
import { LoginPage } from "./pages/LoginPage.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <AppHeader />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
