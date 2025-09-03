import { Suspense } from "react";
import { DashboardContainer } from "../../features/task-management";

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardContainer />
    </Suspense>
  );
}
