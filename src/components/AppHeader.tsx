import { NavLink } from "react-router-dom";

import type { NavItem } from "../types/navigation.ts";

const navItems: NavItem[] = [
  { to: "/", label: "Home" },
  { to: "/favorites", label: "Favorites" },
  { to: "/login", label: "Login" },
];

export function AppHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <NavLink to="/" className="brand">
          Movie Explorer AI
        </NavLink>
        <nav aria-label="Main">
          <ul>
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
