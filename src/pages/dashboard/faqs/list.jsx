import { Helmet } from "react-helmet-async";

import { CONFIG } from "src/global-config";
import { FaqsView } from "src/sections/faqs/view/faqs-view";

// ----------------------------------------------------------------------

const metadata = { title: `FAQS - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <FaqsView />
    </>
  );
}
