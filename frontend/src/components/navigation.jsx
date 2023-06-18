import { useId } from "react";
import { NavLink } from "react-router-dom";

const Navigation = () => {
  const navigations = [
    { id: useId(), name: "Home", to: "/" },
    { id: useId(), name: "Explore", to: "/explore" },
    { id: useId(), name: "Bookmarks", to: "/bookmarks" },
  ];

  return (
    <nav>
      <ul>
        {navigations.map(({ id, name, to }) => (
          <li key={id}>
            <NavLink to={to}>{name}</NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
