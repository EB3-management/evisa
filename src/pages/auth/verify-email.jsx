import { Helmet } from "react-helmet-async";

import { CONFIG } from "src/global-config";

import { VerifyEmailView } from "src/auth/view";

// ----------------------------------------------------------------------

const metadata = { title: `Verify Email - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <VerifyEmailView />
    </>
  );
}
