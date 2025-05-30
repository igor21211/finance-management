import Link from 'next/link';
import Image from 'next/image';
import logo from '@/public/logo.svg';
export const HeaderLogo = () => {
  return (
    <Link href="/">
      <div className="lg:flex hidden items-center gap-x-2">
        <Image src={logo} alt="logo" width={100} height={100} />
        <p className="font-semibold text-white text-2xl ml-2.5">
          Finance
        </p>
      </div>
    </Link>
  );
};
