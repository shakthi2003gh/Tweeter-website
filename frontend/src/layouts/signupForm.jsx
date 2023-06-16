import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Joi from "joi";
import InputGroup from "../components/inputGroup";

function SignupForm() {
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const schema = {
    name: Joi.string().required().min(3).max(50),
    email: Joi.string().email({ tlds: false }).required().min(5).max(50),
    password: Joi.string().required().min(5).max(50),
  };

  const isDisabled = useMemo(() => {
    const { error } = Joi.object(schema).validate({ name, email, password });

    return !!error?.details[0].message;
  }, [name, email, password, schema]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputGroup
        label="Username"
        value={name}
        onChange={setName}
        error={nameError}
        setError={setNameError}
        schema={schema.name}
      />
      <InputGroup
        type="email"
        label="Email"
        value={email}
        onChange={setEmail}
        error={emailError}
        setError={setEmailError}
        schema={schema.email}
      />

      <InputGroup
        type="Password"
        label="Password"
        value={password}
        onChange={setPassword}
        error={passwordError}
        setError={setPasswordError}
        schema={schema.password}
      />

      <button
        type="submit"
        className="btn btn-primary mt-2"
        style={{ float: "right" }}
        disabled={isDisabled || loading}
      >
        Submit
      </button>

      <Link to={"/auth?method=signin"} className="btn btn-secondary mt-2">
        login
      </Link>
    </form>
  );
}

export default SignupForm;
