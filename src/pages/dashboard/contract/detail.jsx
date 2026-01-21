import { Helmet } from "react-helmet-async";
import { CONFIG } from "src/global-config";
import { useParams } from "src/routes/hooks";
import { ContractDetailView } from "src/sections/contract/view/contract-detail-view";

const metadata = { title: `Contract details - ${CONFIG.appName}` };

export default function Page() {
  const { id = "" } = useParams();

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ContractDetailView id={id} />
    </>
  );
}
