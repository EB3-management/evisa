import { Helmet } from "react-helmet-async";

import { CONFIG } from "src/global-config";
import { GuideView } from "src/sections/faqs/view/guide-view";

// ----------------------------------------------------------------------

const metadata = { title: `Guide - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <GuideView />

    </>
  );
}
