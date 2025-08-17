import { Link } from "react-router-dom";

export const LogoContainer = () => {
  return (
    <Link to={"/"}>
      <img
        src="/img/logo/logo.jpg"
        alt="PTK Creative Logo"
        className="min-w-12 min-h-12 w-12 h-12 object-contain rounded-md"
      />
    </Link>
  );
};