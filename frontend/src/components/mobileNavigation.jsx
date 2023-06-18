import { useId } from "react";
import { NavLink } from "react-router-dom";

const MobileNavigation = () => {
  const navigations = [
    { id: useId(), name: "house-fill", to: "/" },
    { id: useId(), name: "globe", to: "/explore" },
    { id: useId(), name: "bookmark-fill", to: "/bookmarks" },
  ];

  return (
    <nav className="mobile-navigation">
      <ul>
        {navigations.map(({ id, name, to }) => (
          <li key={id}>
            <NavLink to={to}>
              <i className={`bi bi-${name}`}></i>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MobileNavigation;
