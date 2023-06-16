import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SignupForm from "../layouts/signupForm";
import SigninForm from "../layouts/signinForm";
import "react-toastify/dist/ReactToastify.css";

function Auth() {
  let [searchParams, setSearchParams] = useSearchParams();
  const methods = ["signin", "signup"];
  const method = searchParams.get("method");

  useEffect(() => {
    if (!methods.includes(method)) setSearchParams({ method: "signin" });
  }, [method]);

  return (
    <div className="auth flex-center vh-100">
      <div
        className="container align-items-center w-100 px-3"
        style={{ maxWidth: "390px" }}
      >
        <h1 className="text-center mb-5 fw-bolder text-primary text-capitalize">
          {method}
        </h1>

        {method === "signup" ? <SignupForm /> : <SigninForm />}
      </div>
    </div>
  );
}

export default Auth;
