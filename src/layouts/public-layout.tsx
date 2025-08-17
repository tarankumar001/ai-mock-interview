import { Outlet } from "react-router-dom";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import AuthHanlder from "@/handlers/user-auth-handler";

export const PublicLayout = () => {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <AuthHanlder/>
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
