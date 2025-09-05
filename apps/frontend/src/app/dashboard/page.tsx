import { Suspense } from 'react';
import { DashboardContainer } from '@/features';

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardContainer />
    </Suspense>
  );
}
