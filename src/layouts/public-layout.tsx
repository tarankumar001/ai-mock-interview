import { Outlet } from "react-router-dom";
import { Header } from "@/components/header";

export const PublicLayout = () => {
  return (
    <div className="w-full">
      <Header />
      <Outlet />
      <h1>Footer</h1>
    </div>
  );
};
