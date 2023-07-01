import { Link } from "react-router-dom";
import useMediaQuery from "../hooks/useMediaQuery";
import logoImage from "../assets/tweeter.svg";
import smallLogo from "../assets/tweeter-small.svg";
import Navigation from "../components/navigation";
import ProfileMenu from "../components/profileMenu";

function Header() {
  const isNonMobileDisplay = useMediaQuery(600);

  return (
    <header>
      <div className="container">
        <Link to="/">
          <picture>
            <source media="(min-width: 770px)" srcSet={logoImage} />
            <source media="(max-width: 770px)" srcSet={smallLogo} />
            <img src={logoImage} alt="" />
          </picture>
        </Link>

        {isNonMobileDisplay && <Navigation />}

        <ProfileMenu />
      </div>
    </header>
  );
}

export default Header;
