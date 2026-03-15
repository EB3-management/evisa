import { Helmet } from "react-helmet-async";
import { CONFIG } from "src/global-config";
import { FinanceAssign } from "src/sections/app/plan/finance-assign";

const metadata = { title: `Finance - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <FinanceAssign />
    </>
  );
}
