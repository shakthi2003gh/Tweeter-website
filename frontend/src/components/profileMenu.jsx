import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/http";

function ProfileMenu() {
  const navigate = useNavigate();
  const userImagePath = useSelector((state) => state.user.image);
  const path = import.meta.env.VITE_API_ENDPOINT + "/" + userImagePath;

  const handleClick = () => {
    logoutUser();
    navigate("/auth");
  };

  return (
    <div className="profile-menu">
      <Link to="/profile">
        {userImagePath ? (
          <img src={path} alt="" />
        ) : (
          <i className="bi bi-person-circle"></i>
        )}
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
