import { useState, useRef, useEffect } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  IconButton,
  Paper,
  Typography,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Iconify } from "src/components/iconify";
import { toast } from "sonner";
import SignatureCanvas from "react-signature-canvas";

export function ContractSigningDialog({
  open,
  onClose,
  contract,
  onSubmitSignature,
}) {
  const [showSignature, setShowSignature] = useState(false);
  const [signatureData, setSignatureData] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ width: 500, height: 200 });
  const [pdfError, setPdfError] = useState(null);
  const signatureRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Convert external URL to proxied URL for CORS bypass
  const getProxiedPdfUrl = (url) => {
    if (!url) return null;
    // Replace the API domain with relative path to use Vite proxy
    return url.replace('https://eb3api.walkershive.com', '');
  };

  // Log PDF URL for debugging
  useEffect(() => {
    if (contract?.unsigned_pdf_url) {
      const proxiedUrl = getProxiedPdfUrl(contract.unsigned_pdf_url);
      console.log("Original PDF URL:", contract.unsigned_pdf_url);
      console.log("Proxied PDF URL:", proxiedUrl);
      setPdfError(null);
    }
  }, [open, contract]);

  // Update canvas size based on container width
  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasContainerRef.current) {
        const containerWidth = canvasContainerRef.current.offsetWidth;
        const width = containerWidth - 4; // Subtract border width
        const height = isMobile ? 150 : isTablet ? 180 : 200;
        setCanvasSize({ width, height });
      }
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    return () => window.removeEventListener("resize", updateCanvasSize);
  }, [isMobile, isTablet, showSignature]);

  // Restore previous signature when opening signature pad
  useEffect(() => {
    if (showSignature && signatureData && signatureRef.current) {
      // Wait for canvas to be ready
      setTimeout(() => {
        signatureRef.current?.fromDataURL(signatureData);
      }, 100);
    }
  }, [showSignature, signatureData]);

  const handleClearSignature = () => {
    signatureRef.current?.clear();
    setSignatureData(null);
  };

  const handleSaveSignature = () => {
    if (signatureRef.current?.isEmpty()) {
      toast.error("Please provide your signature");
      return;
    }

    const signature = signatureRef.current?.toDataURL("image/png");
    setSignatureData(signature);
    setShowSignature(false);
    toast.success("Signature saved! Now submit the contract.");
  };

  const handleSubmitContract = async () => {
    if (!signatureData) {
      toast.error("Please sign the contract first");
      setShowSignature(true);
      return;
    }

    try {
      await onSubmitSignature(contract.id, signatureData);
      toast.success("Contract signed successfully!");
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to submit signature");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          height: isMobile ? "100vh" : "90vh",
          m: isMobile ? 0 : 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: 1,
          borderColor: "divider",
          px: { xs: 2, sm: 3 },
          py: { xs: 1.5, sm: 2 },
        }}
      >
        <Stack spacing={0.5} sx={{ flex: 1, mr: 2 }}>
          <Typography variant={isMobile ? "subtitle1" : "h6"} noWrap>
            Contract #{contract?.contract_number}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: { xs: "none", sm: "block" },
            }}
          >
            {contract?.vacancy?.title} -{" "}
            {contract?.vacancy?.employer?.company_name}
          </Typography>
        </Stack>
        <IconButton onClick={onClose}>
          <Iconify icon="eva:close-fill" />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          p: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* PDF Viewer */}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            "& .rpv-core__viewer": {
              height: "100%",
            },
          }}
        >
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer
              fileUrl={getProxiedPdfUrl(contract?.unsigned_pdf_url)}
              plugins={[defaultLayoutPluginInstance]}
            />
          </Worker>
        </Box>

        {/* Signature Section */}
        {showSignature && (
          <Paper
            sx={{
              p: { xs: 1.5, sm: 2 },
              m: { xs: 1, sm: 2 },
              borderRadius: 2,
              border: 1,
              borderColor: "primary.main",
            }}
          >
            <Typography variant={isMobile ? "body2" : "subtitle2"} gutterBottom>
              Sign below to accept the contract terms
            </Typography>
            <Box
              ref={canvasContainerRef}
              sx={{
                border: 2,
                borderColor: "divider",
                borderRadius: 1,
                bgcolor: "background.paper",
                mb: 2,
                overflow: "hidden",
                width: "100%",
              }}
            >
              <SignatureCanvas
                ref={signatureRef}
                canvasProps={{
                  width: canvasSize.width,
                  height: canvasSize.height,
                  style: {
                    width: "100%",
                    height: "100%",
                    touchAction: "none",
                  },
                }}
                backgroundColor="#ffffff"
              />
            </Box>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ width: "100%" }}
            >
              <Button
                fullWidth={isMobile}
                variant="outlined"
                color="error"
                onClick={handleClearSignature}
                startIcon={<Iconify icon="eva:trash-2-outline" />}
              >
                Clear
              </Button>
              <Button
                fullWidth={isMobile}
                variant="contained"
                onClick={handleSaveSignature}
                startIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
              >
                Save Signature
              </Button>
            </Stack>
          </Paper>
        )}

        {/* Signature Preview */}
        {signatureData && !showSignature && (
          <Paper
            sx={{
              p: { xs: 1.5, sm: 2 },
              m: { xs: 1, sm: 2 },
              borderRadius: 2,
              bgcolor: "success.lighter",
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Iconify
                  icon="eva:checkmark-circle-2-fill"
                  color="success.main"
                  width={24}
                />
                <Typography variant="body2" color="success.dark">
                  Signature saved
                </Typography>
              </Stack>
              <Button
                size="small"
                onClick={() => setShowSignature(true)}
                startIcon={<Iconify icon="eva:edit-outline" />}
                fullWidth={isMobile}
              >
                Edit Signature
              </Button>
            </Stack>
          </Paper>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          p: { xs: 1.5, sm: 2 },
          borderTop: 1,
          borderColor: "divider",
          flexDirection: { xs: "column", sm: "row" },
          gap: 1,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          fullWidth={isMobile}
        >
          Cancel
        </Button>
        <Box sx={{ flex: { sm: 1 } }} />
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          {!showSignature && !signatureData && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowSignature(true)}
              startIcon={<Iconify icon="eva:edit-outline" />}
              fullWidth={isMobile}
            >
              Add Signature
            </Button>
          )}
          {signatureData && (
            <Button
              variant="contained"
              color="success"
              onClick={handleSubmitContract}
              startIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
              fullWidth={isMobile}
            >
              Submit Signed Contract
            </Button>
          )}
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
