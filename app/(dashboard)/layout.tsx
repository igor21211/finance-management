import { Header } from '@/components/header';
import { Suspense } from 'react';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <Header />
      <main>{children}</main>
    </Suspense>
  );
}
