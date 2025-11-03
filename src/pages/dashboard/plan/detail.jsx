import { Helmet } from "react-helmet-async";
import { useParams } from "react-router";
import { CONFIG } from "src/global-config";
import { PlanDetail } from "src/sections/app/plan/detail/plan-detail";

const metadata = { title: `Payment - ${CONFIG.appName}` };

export default function Page() {

   const { id = "" } = useParams();
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PlanDetail id={id} />
    </>
  );
}
