// ----------------------------------------------------------------------

import { Helmet } from "react-helmet-async";
import { CONFIG } from "src/global-config";
import { VisaStatusTimeline } from "src/sections/visa-status/view/visa-status-timeline";

const metadata = { title: `Visa Status - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <VisaStatusTimeline />
    </>
  );
}
