import { Helmet } from "react-helmet-async";
import { useParams } from "react-router";
import { CONFIG } from "src/global-config";
import { PlanList } from "src/sections/app/plan/plan-view";

const metadata = { title: `Plan Policy - ${CONFIG.appName}` };

export default function Page() {
  const { id = "" } = useParams();
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PlanList id={id} />
    </>
  );
}
