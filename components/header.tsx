import { Navigation } from './navigation';
import { HeaderLogo } from './header-logo';
import { ClerkLoading, UserButton } from '@clerk/nextjs';
import { ClerkLoaded } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';
import { WelcomeMessage } from './welcome-message';

export const Header = () => {
  return (
    <header className="bg-gradient-to-b from-blue-700 to-blue-500 px-4 py-8 lg:px-14 pb-36">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="w-full flex items-center justify-between mb-14">
            <div className="flex items-center lg:gap-x-16 ">
              <HeaderLogo />
              <Navigation />
            </div>
            <ClerkLoaded>
              <UserButton
                afterSwitchSessionUrl="/"
                appearance={{
                  elements: {
                    avatarBox: 'h-10 w-10',
                    userButtonPopoverCard: 'w-40',
                  },
                }}
              />
            </ClerkLoaded>
            <ClerkLoading>
              <Loader2 className="size-8 animate-spin text-slate-400" />
            </ClerkLoading>
          </div>
        </div>
        <WelcomeMessage />
      </div>
    </header>
  );
};
