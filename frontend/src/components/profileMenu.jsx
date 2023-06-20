import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { logoutUser } from "../services/http";
import UserImage from "./userImage";

function ProfileMenu() {
  const navigate = useNavigate();
  const path = useSelector((state) => state.user.image);

  const handleClick = () => {
    logoutUser();
    navigate("/auth");
  };

  return (
    <div className="profile-menu">
      <Link to="/profile">
        <UserImage path={path} />
      </Link>

      <div className="menu">
        <button className="btn btn-danger" onClick={handleClick}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default ProfileMenu;
