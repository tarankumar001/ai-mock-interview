import { Outlet } from "react-router-dom";

export const PublicLayout = () => {
  return (
    <div className="w-full">
      <p>Header</p>
      <Outlet />
      <h1>Footer</h1>
    </div>
  );
};
