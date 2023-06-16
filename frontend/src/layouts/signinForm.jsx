import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Joi from "joi";
import InputGroup from "../components/inputGroup";
import { loginUser } from "../services/http";

function SigninForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const schema = {
    email: Joi.string().email({ tlds: false }).required().min(5).max(50),
    password: Joi.string().required().min(5).max(50),
  };

  const isDisabled = useMemo(() => {
    const { error } = Joi.object(schema).validate({ email, password });

    return !!error?.details[0].message;
  }, [email, password, schema]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = { email, password };
    await loginUser(payload)
      .then(() => navigate("/"))
      .finally(() => setLoading(false));
  };

  return (
    <form onSubmit={handleSubmit}>
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

      <Link to={"/auth?method=signup"} className="btn btn-secondary mt-2">
        Signup
      </Link>
    </form>
  );
}

export default SigninForm;
