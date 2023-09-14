function UserImage({ path }) {
  return (
    <div className="user-image">
      {path ? (
        <img src={path} alt="" loading="lazy" />
      ) : (
        <i className="bi bi-person-circle"></i>
      )}
    </div>
  );
}

export default UserImage;
