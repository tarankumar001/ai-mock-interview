import { SignIn } from "@clerk/clerk-react";

export const SignInPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen w-screen relative bg-gray-50">
      <img
        src="/img/bg.png"
        alt="background"
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      />
      <div className="relative z-10">
        <SignIn path="/sign-in" />
      </div>
    </div>
  );
};
