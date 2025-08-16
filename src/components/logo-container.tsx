import { Link } from "react-router-dom";

export const LogoContainer = () => {
  return (
    <Link to={"/"}>
      <img
        src="/svg/logo.svg"
        alt=""
  className="min-w-12 min-h-12 w-12 h-12 object-contain"
      />
    </Link>
  );
};