export const Input = ({
  label,
  classname,
  type,
  name,
  placeholder,
  ...props
}) => {
  return (
    <>
      {label && <label classname={classname}>{label}</label>}
      <input
        type={type}
        name={name}
        className={classname}
        placeholder={placeholder}
      />
    </>
  );
};
