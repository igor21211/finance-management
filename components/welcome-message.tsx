'use client';

import { useUser } from '@clerk/nextjs';

export const WelcomeMessage = () => {
  const { user, isLoaded } = useUser();
  if (!isLoaded) return null;
  return (
    <div className="space-y-2 mb-4">
      <h2 className="text-white font-medium text-2xl lg:text-4xl">
        Welcome back {isLoaded ? ', ' : ' '}
        {user?.fullName}
      </h2>
      <p className="text-sm lg:text-base text-[#89b6fd]">
        Check your daily report and manage your account.
      </p>
    </div>
  );
};
