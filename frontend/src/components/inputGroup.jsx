import { useId } from "react";

function InputGroup(props) {
  const id = useId();
  const {
    type = "text",
    label,
    value,
    onChange,
    error,
    setError,
    schema,
  } = props;

  const handleChange = (e) => {
    const { error, value } = schema
      .label(label.toLowerCase())
      .validate(e.target.value);

    onChange(value);
    setError(error?.details[0].message);
  };

  return (
    <div className="mb-3">
      <label
        htmlFor={id}
        className={"form-label " + (error ? "text-danger" : "text-primary")}
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        className={"form-control" + (error ? " is-invalid" : "")}
        value={value}
        onChange={handleChange}
      />

      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}

export default InputGroup;
