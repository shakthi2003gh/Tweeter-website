import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Joi from "joi";
import InputGroup from "../components/inputGroup";
import { userUpdate } from "../services/http";

function ProfileEdit() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const imageRef = useRef(null);

  const [image, setImage] = useState(user.image || "");
  const [fileBlob, setFileBlob] = useState(undefined);

  const [name, setName] = useState(user.name || "");
  const [bio, setBio] = useState(user.bio || "Hey there! I am using Tweeter");

  const [nameError, setNameError] = useState("");
  const [bioError, setBioError] = useState("");

  const schema = {
    name: Joi.string().min(3).max(50),
    bio: Joi.string().min(5).max(150),
  };

  const isDisable = useMemo(() => {
    const { error } = Joi.object(schema).validate({ name, bio });

    if (!!fileBlob) return false;
    if (user.name === name && user.bio === bio) return true;

    return !!error;
  }, [name, bio, fileBlob, schema]);

  const handleImageInput = (e) => {
    if (e.target.files[0]) setFileBlob(e.target.files[0]);
    else if (fileBlob) setFileBlob(undefined);

    const blob = new Blob([e.target.files[0]], { type: "image/jpeg" });
    const blobURL = e.target.files[0] ? URL.createObjectURL(blob) : undefined;

    setImage(blobURL);
  };

  const handleRemoveImage = () => {
    setImage("");
    setFileBlob(undefined);
    imageRef.current.value = null;
  };

  const handleCancel = () => {
    navigate("/profile/" + user._id);
  };

  const handleUpdate = () => {
    const payload = { profile: fileBlob, name, bio };
    setLoading(true);
    userUpdate(payload).then(() => {
      setLoading(false);
      navigate("/profile/" + user._id);
    });
  };

  return (
    <div className="profile-edit">
      <div className="form">
        <label className="image">
          {image && (
            <>
              <img src={image} alt="" />

              <i className="bi bi-trash" onClick={handleRemoveImage}></i>
            </>
          )}

          <input
            ref={imageRef}
            type="file"
            accept="jpg"
            onChange={handleImageInput}
          />
        </label>

        <InputGroup
          label="username"
          value={name}
          onChange={setName}
          error={nameError}
          setError={setNameError}
          schema={schema.name}
        />
        <InputGroup
          label="bio"
          value={bio}
          onChange={setBio}
          error={bioError}
          setError={setBioError}
          schema={schema.bio}
        />

        <div className="buttons" onClick={handleCancel}>
          <button className="btn btn-secondary">cancel</button>

          <button
            className="btn btn-primary"
            disabled={isDisable || loading}
            onClick={handleUpdate}
          >
            update
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileEdit;
