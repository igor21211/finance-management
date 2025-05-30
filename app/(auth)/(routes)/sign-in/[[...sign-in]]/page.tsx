import { SignIn, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import logo from "@/public/logo.svg";
import textLogo from "@/public/text-logo.svg";
import { Loader2 } from "lucide-react";
import Image from "next/image";
export default function SignInPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="h-full  lg:flex flex-col items-center justify-center px-4">
        <div className="text-center space-y4 pt-16">
          <h1 className="font-bold text-3xl text-[#2E2A47]">Welcome Back!</h1>
          <p className="text-base text-[#7E8CA0]">
            Log in or Create an account to get back to your dashboard
          </p>
        </div>
        <div className="flex items-center justify-center mt-8">
          <ClerkLoaded>
            <SignIn path="/sign-in" />
          </ClerkLoaded>
          <ClerkLoading>
            <Loader2 className="w-6 h-6 animate-spin" />
          </ClerkLoading>
        </div>
      </div>
      <div className="h-full  bg-blue-600 hidden lg:flex flex-col gap-4 items-center justify-center">
        <Image src={logo} alt="sign-in" width={200} height={300} />
        <Image src={textLogo} alt="sign-in" width={300} height={300} />
      </div>
    </div>
  );
}
