import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AppHeader } from "./components/AppHeader.tsx";
import { RequireAuth } from "./components/RequireAuth.tsx";
import { AuthProvider } from "./context/AuthProvider.tsx";
import { FavoritesProvider } from "./context/FavoritesProvider.tsx";
import { FavoritesPage } from "./pages/FavoritesPage.tsx";
import { HomePage } from "./pages/HomePage.tsx";
import { LoginPage } from "./pages/LoginPage.tsx";
import { MovieDetailsPage } from "./pages/MovieDetailsPage.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <FavoritesProvider>
      <div className="app-shell">
        <AppHeader />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movie/:id" element={<MovieDetailsPage />} />
            <Route
              path="/favorites"
              element={
                <RequireAuth>
                  <FavoritesPage />
                </RequireAuth>
              }
            />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </main>
      </div>
      </FavoritesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
