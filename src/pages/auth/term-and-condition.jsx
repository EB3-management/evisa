import { Helmet } from "react-helmet-async";
import { TermsAndConditions } from "src/auth/view/term-and-condition";

import { CONFIG } from "src/global-config";

// ----------------------------------------------------------------------

const metadata = { title: `Terms and Condition - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TermsAndConditions />
    </>
  );
}
