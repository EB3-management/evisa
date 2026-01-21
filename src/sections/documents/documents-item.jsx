import {
  TableRow,
  TableCell,
  Chip,
  IconButton,
  Checkbox,
  Button,
} from "@mui/material";
import { Iconify } from "src/components/iconify";
import { fDateTime } from "src/utils/format-time";
import { ContractSigningDialog } from "../contract/dialog/contract-signing-dialog";
import { useState } from "react";
import { useAppDispatch } from "src/redux/hooks";
import { signContract } from "src/api/document";
import { toast } from "sonner";
import { fetchDocumentsRequest } from "src/redux/actions";
import { useRouter } from "src/routes/hooks";
import { paths } from "src/routes/paths";

// ----------------------------------------------------------------------

export function DocumentsTableRow({
  serialNumber,
  row,
  selected,
  onSelectRow,
}) {
  const [openSigning, setOpenSigning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const getStatusChipColor = (status) => {
    switch (status) {
      case "signed":
        return { bgcolor: "#D2F3EE", color: "#2BA597" };
      case "rejected":
        return { bgcolor: "#FFE7E7", color: "#D32F2F" };
      case "pending_signature":
      default:
        return { bgcolor: "#FFF4E5", color: "#F57C00" };
    }
  };

  const handleViewPdf = (url) => {
    window.open(url, "_blank");
  };

  const handleContractView = (id) => {
    router.push(paths.dashboard.contract.detail(id));
  };

  const handleSubmitSignature = async (contractId, signatureData) => {
    setIsSubmitting(true);
    try {
      // Send signature in the format backend expects
      const response = await signContract(contractId, {
        signature: signatureData, // signatureData is already in base64 format
      });
      // console.log("this is contract data", contractId, signatureData);
      toast.success(response.message || "Contract signed successfully!");

      // Refresh the contract list
      dispatch(fetchDocumentsRequest());

      setOpenSigning(false);
    } catch (error) {
      console.error("Sign contract error:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to sign contract";
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1} selected={selected}>
        {/* <TableCell padding="checkbox">
      <Checkbox checked={selected} onClick={onSelectRow} />
    </TableCell> */}

        <TableCell sx={{ minWidth: { xs: 40, sm: 50 } }}>
          {serialNumber}
        </TableCell>

        <TableCell
          sx={{
            whiteSpace: "nowrap",
            minWidth: { xs: 120, sm: 150 },
          }}
        >
          {row.contract_number}
        </TableCell>

        <TableCell
          onClick={() => handleContractView(row.id)}
          sx={{
            whiteSpace: "nowrap",
            minWidth: { xs: 120, sm: 150 },
            maxWidth: { xs: 150, sm: 200 },
            overflow: "hidden",
            textOverflow: "ellipsis",
            cursor: "pointer",
            color: "primary.main",
            fontWeight: 600,
            textDecoration: "underline",
            textDecorationColor: "transparent",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              color: "primary.dark",
              textDecorationColor: "primary.dark",
              backgroundColor: "action.hover",
            },
          }}
        >
          {row.vacancy?.title || "-"}
        </TableCell>

        <TableCell
          sx={{
            whiteSpace: "nowrap",
            minWidth: { xs: 100, sm: 150 },
            maxWidth: { xs: 150, sm: 200 },
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {row.vacancy?.employer?.company_name || "-"}
        </TableCell>

        <TableCell
          sx={{
            whiteSpace: "nowrap",
            minWidth: { xs: 80, sm: 120 },
          }}
        >
          {row.vacancy?.location || "-"}
        </TableCell>

        <TableCell
          sx={{
            whiteSpace: "nowrap",
            minWidth: { xs: 70, sm: 90 },
          }}
        >
          {row.vacancy?.wages ? `$${row.vacancy.wages}` : "-"}
        </TableCell>

        <TableCell sx={{ minWidth: { xs: 100, sm: 120 } }}>
          <Chip
            label={row.status?.replace("_", " ")}
            size="small"
            sx={{
              textTransform: "capitalize",
              fontSize: { xs: "0.65rem", sm: "0.75rem" },
              height: { xs: 20, sm: 24 },
              ...getStatusChipColor(row.status),
              animation: "popup 1s ease-out infinite",
              "@keyframes popup": {
                "0%": {
                  transform: "scale(0.9)",
                  opacity: 0.7,
                },
                "60%": {
                  transform: "scale(1.1)",
                  opacity: 1,
                },
                "100%": {
                  transform: "scale(1)",
                  opacity: 1,
                },
              },
            }}
          />
        </TableCell>

        <TableCell align="center" sx={{ minWidth: { xs: 50, sm: 70 } }}>
          {row.unsigned_pdf_url ? (
            <IconButton
              size="small"
              onClick={() => handleViewPdf(row.unsigned_pdf_url)}
              sx={{ padding: { xs: "4px", sm: "8px" } }}
            >
              <Iconify icon="eva:file-text-fill" width={{ xs: 18, sm: 20 }} />
            </IconButton>
          ) : (
            "-"
          )}
        </TableCell>

        <TableCell align="center" sx={{ minWidth: { xs: 50, sm: 70 } }}>
          {row?.status === "signed" && row.signed_pdf_url ? (
            // Show signed PDF download button if status is signed
            <Button
              size="small"
              variant="text"
              color="success"
              onClick={() => handleViewPdf(row.signed_pdf_url)}
              startIcon={
                <Iconify
                  icon="eva:checkmark-circle-2-fill"
                  width={{ xs: 18, sm: 20 }}
                />
              }
              sx={{
                padding: { xs: "4px", sm: "8px" },
                textTransform: "none",
                fontWeight: 600,
                fontSize: { xs: "0.7rem", sm: "0.875rem" },
              }}
            >
              Signed PDF
            </Button>
          ) : row?.status === "pending_signature" ? (
            // Show Sign button if status is pending_signature
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={() => setOpenSigning(true)}
              startIcon={<Iconify icon="eva:edit-outline" />}
            >
              Sign
            </Button>
          ) : (
            "-"
          )}
        </TableCell>

        <TableCell
          sx={{
            whiteSpace: "nowrap",
            minWidth: { xs: 100, sm: 140 },
            fontSize: { xs: "0.7rem", sm: "0.875rem" },
          }}
        >
          {row.generated_at ? fDateTime(row.generated_at) : "-"}
        </TableCell>
      </TableRow>
      <ContractSigningDialog
        open={openSigning}
        onClose={() => setOpenSigning(false)}
        contract={row}
        onSubmitSignature={handleSubmitSignature}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
