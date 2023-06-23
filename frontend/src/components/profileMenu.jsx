import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { logoutUser } from "../services/http";
import UserImage from "./userImage";

function ProfileMenu() {
  const navigate = useNavigate();
  const { _id, image } = useSelector((state) => state.user);

  const handleClick = () => {
    logoutUser();
    navigate("/auth");
  };

  return (
    <div className="profile-menu">
      <Link to={"/profile/" + _id}>
        <UserImage path={image} />
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
