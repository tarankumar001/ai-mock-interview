import { Outlet } from "react-router-dom";
import { Header } from "@/components/header";
import AuthHanlder from "@/handlers/user-auth-handler";

export const PublicLayout = () => {
  return (
    <div className="w-full">
      <AuthHanlder/>
      <Header />
      <Outlet />
      <h1>Footer</h1>
    </div>
  );
};
