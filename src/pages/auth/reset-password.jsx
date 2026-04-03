import { Helmet } from "react-helmet-async";
import { ResetPassword } from "src/auth/view/reset-password";

import { CONFIG } from "src/global-config";

// ----------------------------------------------------------------------

const metadata = { title: `Reset Password - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ResetPassword />
    </>
  );
}
