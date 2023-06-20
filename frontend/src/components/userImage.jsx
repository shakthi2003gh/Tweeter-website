function UserImage({ path }) {
  const src = import.meta.env.VITE_API_ENDPOINT + "/" + path;

  return (
    <div className="user-image">
      {path ? (
        <img src={src} alt="" loading="lazy" />
      ) : (
        <i className="bi bi-person-circle"></i>
      )}
    </div>
  );
}

export default UserImage;
