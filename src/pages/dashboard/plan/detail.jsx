import { Helmet } from "react-helmet-async";
import { CONFIG } from "src/global-config";
import { PlanDetail } from "src/sections/app/plan/detail/plan-detail";

const metadata = { title: `Plan Policy - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PlanDetail />
    </>
  );
}
