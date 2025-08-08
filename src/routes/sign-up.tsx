import { SignUp } from "@clerk/clerk-react";

export const SignUpPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen w-screen relative bg-gray-50">
      <img
        src="/img/bg.png"
        alt="background"
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      />
      <div className="relative z-10">
        <SignUp path="/sign-up" />
      </div>
    </div>
  );
};
