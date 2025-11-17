// import { useState, useRef, useEffect } from "react";
// import { Worker, Viewer } from "@react-pdf-viewer/core";
// import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
// import "@react-pdf-viewer/core/lib/styles/index.css";
// import "@react-pdf-viewer/default-layout/lib/styles/index.css";
// import {
//   Box,
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   DialogActions,
//   Button,
//   IconButton,
//   Paper,
//   Typography,
//   Stack,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material";
// import { Iconify } from "src/components/iconify";
// import { toast } from "sonner";
// import SignatureCanvas from "react-signature-canvas";

// export function ContractSigningDialog({
//   open,
//   onClose,
//   contract,
//   onSubmitSignature,
//   isSubmitting = false,
// }) {
//   const [showSignature, setShowSignature] = useState(false);
//   const [signatureData, setSignatureData] = useState(null);
//   const [canvasSize, setCanvasSize] = useState({ width: 500, height: 200 });
//   const [pdfError, setPdfError] = useState(null);
//   const signatureRef = useRef(null);
//   const canvasContainerRef = useRef(null);
//   const defaultLayoutPluginInstance = defaultLayoutPlugin();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const isTablet = useMediaQuery(theme.breakpoints.down("md"));

//   // // // Convert external URL to proxied URL for CORS bypass
//   // // const getProxiedPdfUrl = (url) => {
//   // //   if (!url) return null;
//   // //   // Replace the API domain with relative path to use Vite proxy
//   // //   return url.replace("https://eb3api.walkershive.com", "");
//   // // };

//   // // Log PDF URL for debugging
//   // useEffect(() => {
//   //   if (contract?.unsigned_pdf_url) {
//   //     // const proxiedUrl = getProxiedPdfUrl(contract.unsigned_pdf_url);
//   //     console.log("Original PDF URL:", contract.unsigned_pdf_url);
//   //     // console.log("Proxied PDF URL:", proxiedUrl);
//   //     setPdfError(null);
//   //   }
//   // }, [open, contract]);

//   // ✅ Smart PDF URL handler - works in both dev and production
//   const getPdfUrl = (url) => {
//     if (!url) return null;

//     // In development (localhost), use Vite proxy
//     if (
//       window.location.hostname === "localhost" ||
//       window.location.hostname === "127.0.0.1"
//     ) {
//       // Remove the API domain to use proxy: /uploads/contracts/...
//       return url.replace("https://eb3api.walkershive.com", "");
//     }

//     // In production, use direct URL (CORS should be configured on backend)
//     return url;
//   };

//   const pdfUrl = getPdfUrl(contract?.unsigned_pdf_url);

//   // Log PDF URL for debugging
//   useEffect(() => {
//     if (contract?.unsigned_pdf_url) {
//       console.log("Original PDF URL:", contract.unsigned_pdf_url);
//       console.log("Final PDF URL:", pdfUrl);
//       console.log("Environment:", window.location.hostname);
//       setPdfError(null);
//     }
//   }, [open, contract, pdfUrl]);

//   // Update canvas size based on container width
//   useEffect(() => {
//     const updateCanvasSize = () => {
//       if (canvasContainerRef.current) {
//         const containerWidth = canvasContainerRef.current.offsetWidth;
//         const width = containerWidth - 4; // Subtract border width
//         const height = isMobile ? 150 : isTablet ? 180 : 200;
//         setCanvasSize({ width, height });
//       }
//     };

//     updateCanvasSize();
//     window.addEventListener("resize", updateCanvasSize);

//     return () => window.removeEventListener("resize", updateCanvasSize);
//   }, [isMobile, isTablet, showSignature]);

//   // Restore previous signature when opening signature pad
//   useEffect(() => {
//     if (showSignature && signatureData && signatureRef.current) {
//       // Wait for canvas to be ready
//       setTimeout(() => {
//         signatureRef.current?.fromDataURL(signatureData);
//       }, 100);
//     }
//   }, [showSignature, signatureData]);

//   const handleClearSignature = () => {
//     signatureRef.current?.clear();
//     setSignatureData(null);
//   };

//   const handleSaveSignature = () => {
//     if (signatureRef.current?.isEmpty()) {
//       toast.error("Please provide your signature");
//       return;
//     }

//     const signature = signatureRef.current?.toDataURL("image/png");
//     setSignatureData(signature);
//     setShowSignature(false);
//     toast.success("Signature saved! Now submit the contract.");
//   };

//   const handleSubmitContract = async () => {
//     if (!signatureData) {
//       toast.error("Please sign the contract first");
//       setShowSignature(true);
//       return;
//     }

//     try {
//       await onSubmitSignature(contract.id, signatureData);
//       // toast.success(response.message || "Contract signed successfully!");
//       // onClose(); // Don't close here, let parent handle it after success
//     } catch (error) {
//       // Error already handled in parent component
//       console.error("Submit contract error:", error);
//     }
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="lg"
//       fullWidth
//       fullScreen={isMobile}
//       PaperProps={{
//         sx: {
//           height: isMobile ? "100vh" : "90vh",
//           m: isMobile ? 0 : 2,
//         },
//       }}
//     >
//       <DialogTitle
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           borderBottom: 1,
//           borderColor: "divider",
//           px: { xs: 2, sm: 3 },
//           py: { xs: 1.5, sm: 2 },
//         }}
//       >
//         <Stack spacing={0.5} sx={{ flex: 1, mr: 2 }}>
//           <Typography variant={isMobile ? "subtitle1" : "h6"} noWrap>
//             Contract #{contract?.contract_number}
//           </Typography>
//           <Typography
//             variant="caption"
//             color="text.secondary"
//             sx={{
//               display: { xs: "none", sm: "block" },
//             }}
//           >
//             {contract?.vacancy?.title} -{" "}
//             {contract?.vacancy?.employer?.company_name}
//           </Typography>
//         </Stack>
//         <IconButton onClick={onClose}>
//           <Iconify icon="eva:close-fill" />
//         </IconButton>
//       </DialogTitle>

//       <DialogContent
//         sx={{
//           p: 0,
//           display: "flex",
//           flexDirection: "column",
//           overflow: "hidden",
//         }}
//       >
//         {/* PDF Viewer */}
//         <Box
//           sx={{
//             flex: 1,
//             overflow: "auto",
//             "& .rpv-core__viewer": {
//               height: "100%",
//             },
//           }}
//         >
//           <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
//             <Viewer
//               fileUrl={pdfUrl}
//               plugins={[defaultLayoutPluginInstance]}
//               onDocumentLoadError={(error) => {
//                 console.error("PDF Load Error:", error);
//                 setPdfError(error.message);
//               }}
//             />
//           </Worker>

//           {pdfError && (
//             <Box
//               sx={{
//                 p: 3,
//                 textAlign: "center",
//                 bgcolor: "error.lighter",
//                 borderRadius: 2,
//                 m: 2,
//               }}
//             >
//               <Iconify
//                 icon="eva:alert-circle-fill"
//                 color="error.main"
//                 width={48}
//                 sx={{ mb: 2 }}
//               />
//               <Typography variant="h6" color="error.main" gutterBottom>
//                 Failed to Load PDF
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 {pdfError}
//               </Typography>
//               <Button
//                 variant="outlined"
//                 color="error"
//                 onClick={() =>
//                   window.open(contract?.unsigned_pdf_url, "_blank")
//                 }
//                 startIcon={<Iconify icon="eva:external-link-outline" />}
//                 sx={{ mt: 2 }}
//               >
//                 Open PDF in New Tab
//               </Button>
//             </Box>
//           )}
//         </Box>

//         {/* Signature Section */}
//         {showSignature && (
//           <Paper
//             sx={{
//               p: { xs: 1.5, sm: 2 },
//               m: { xs: 1, sm: 2 },
//               borderRadius: 2,
//               border: 1,
//               borderColor: "primary.main",
//             }}
//           >
//             <Typography variant={isMobile ? "body2" : "subtitle2"} gutterBottom>
//               Sign below to accept the contract terms
//             </Typography>
//             <Box
//               ref={canvasContainerRef}
//               sx={{
//                 border: 2,
//                 borderColor: "divider",
//                 borderRadius: 1,
//                 bgcolor: "background.paper",
//                 mb: 2,
//                 overflow: "hidden",
//                 width: "100%",
//               }}
//             >
//               <SignatureCanvas
//                 ref={signatureRef}
//                 canvasProps={{
//                   width: canvasSize.width,
//                   height: canvasSize.height,
//                   style: {
//                     width: "100%",
//                     height: "100%",
//                     touchAction: "none",
//                   },
//                 }}
//                 backgroundColor="#ffffff"
//               />
//             </Box>
//             <Stack
//               direction={{ xs: "column", sm: "row" }}
//               spacing={2}
//               sx={{ width: "100%" }}
//             >
//               <Button
//                 fullWidth={isMobile}
//                 variant="outlined"
//                 color="error"
//                 onClick={handleClearSignature}
//                 startIcon={<Iconify icon="eva:trash-2-outline" />}
//               >
//                 Clear
//               </Button>
//               <Button
//                 fullWidth={isMobile}
//                 variant="contained"
//                 onClick={handleSaveSignature}
//                 startIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
//               >
//                 Save Signature
//               </Button>
//             </Stack>
//           </Paper>
//         )}

//         {/* Signature Preview */}
//         {signatureData && !showSignature && (
//           <Paper
//             sx={{
//               p: { xs: 1.5, sm: 2 },
//               m: { xs: 1, sm: 2 },
//               borderRadius: 2,
//               bgcolor: "success.lighter",
//             }}
//           >
//             <Stack
//               direction={{ xs: "column", sm: "row" }}
//               spacing={2}
//               justifyContent="space-between"
//               alignItems={{ xs: "flex-start", sm: "center" }}
//             >
//               <Stack direction="row" spacing={2} alignItems="center">
//                 <Iconify
//                   icon="eva:checkmark-circle-2-fill"
//                   color="success.main"
//                   width={24}
//                 />
//                 <Typography variant="body2" color="success.dark">
//                   Signature saved
//                 </Typography>
//               </Stack>
//               <Button
//                 size="small"
//                 onClick={() => setShowSignature(true)}
//                 startIcon={<Iconify icon="eva:edit-outline" />}
//                 fullWidth={isMobile}
//               >
//                 Edit Signature
//               </Button>
//             </Stack>
//           </Paper>
//         )}
//       </DialogContent>

//       <DialogActions
//         sx={{
//           p: { xs: 1.5, sm: 2 },
//           borderTop: 1,
//           borderColor: "divider",
//           flexDirection: { xs: "column", sm: "row" },
//           gap: 1,
//         }}
//       >
//         <Button
//           onClick={onClose}
//           variant="outlined"
//           color="inherit"
//           fullWidth={isMobile}
//           disabled={isSubmitting}
//         >
//           Cancel
//         </Button>
//         <Box sx={{ flex: { sm: 1 } }} />
//         <Stack
//           direction={{ xs: "column", sm: "row" }}
//           spacing={1}
//           sx={{ width: { xs: "100%", sm: "auto" } }}
//         >
//           {!showSignature && !signatureData && (
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={() => setShowSignature(true)}
//               startIcon={<Iconify icon="eva:edit-outline" />}
//               fullWidth={isMobile}
//               disabled={isSubmitting}
//             >
//               Add Signature
//             </Button>
//           )}
//           {signatureData && (
//             <Button
//               variant="contained"
//               color="success"
//               onClick={handleSubmitContract}
//               startIcon={
//                 isSubmitting ? (
//                   <Iconify icon="eos-icons:loading" />
//                 ) : (
//                   <Iconify icon="eva:checkmark-circle-2-fill" />
//                 )
//               }
//               fullWidth={isMobile}
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? "Submitting..." : "Submit Signed Contract"}
//             </Button>
//           )}
//         </Stack>
//       </DialogActions>
//     </Dialog>
//   );
// }

import { useState, useRef, useEffect } from "react";
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
  Alert,
} from "@mui/material";
import { Iconify } from "src/components/iconify";
import { toast } from "sonner";
import SignatureCanvas from "react-signature-canvas";

export function ContractSigningDialog({
  open,
  onClose,
  contract,
  onSubmitSignature,
  isSubmitting = false,
}) {
  const [showSignature, setShowSignature] = useState(false);
  const [signatureData, setSignatureData] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ width: 500, height: 200 });
  const [pdfError, setPdfError] = useState(false);
  const signatureRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const pdfUrl = contract?.unsigned_pdf_url;

  // Update canvas size based on container width
  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasContainerRef.current) {
        const containerWidth = canvasContainerRef.current.offsetWidth;
        const width = containerWidth - 4;
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
      setTimeout(() => {
        signatureRef.current?.fromDataURL(signatureData);
      }, 100);
    }
  }, [showSignature, signatureData]);

  // Reset error when dialog opens
  useEffect(() => {
    if (open) {
      setPdfError(false);
    }
  }, [open]);

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
    } catch (error) {
      console.error("Submit contract error:", error);
    }
  };

  const handleIframeError = () => {
    setPdfError(true);
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
        {/* PDF Viewer using iframe */}
        <Box
          sx={{
            flex: 1,
            overflow: "hidden",
            position: "relative",
            bgcolor: "background.neutral",
          }}
        >
          {!pdfError ? (
            <iframe
              src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
              title="Contract PDF"
              style={{
                width: "100%",
                height: "100%",
                border: "none",
              }}
              onError={handleIframeError}
            />
          ) : (
            <Box
              sx={{
                p: 3,
                textAlign: "center",
                bgcolor: "error.lighter",
                borderRadius: 2,
                m: 2,
              }}
            >
              <Iconify
                icon="eva:alert-circle-fill"
                color="error.main"
                width={48}
                sx={{ mb: 2 }}
              />
              <Typography variant="h6" color="error.main" gutterBottom>
                Failed to Load PDF
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                The PDF could not be displayed in the browser.
              </Typography>
              <Stack spacing={2} alignItems="center">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => window.open(pdfUrl, "_blank")}
                  startIcon={<Iconify icon="eva:external-link-outline" />}
                >
                  Open PDF in New Tab
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  component="a"
                  href={pdfUrl}
                  download
                  startIcon={<Iconify icon="eva:download-outline" />}
                >
                  Download PDF
                </Button>
              </Stack>
            </Box>
          )}

          {/* Info Alert for Mobile */}
          {isMobile && !pdfError && (
            <Alert
              severity="info"
              sx={{
                position: "absolute",
                top: 8,
                left: 8,
                right: 8,
                zIndex: 1,
              }}
            >
              <Typography variant="caption">
                Tap the PDF to view controls
              </Typography>
            </Alert>
          )}
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
          disabled={isSubmitting}
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
              disabled={isSubmitting}
            >
              Add Signature
            </Button>
          )}
          {signatureData && (
            <Button
              variant="contained"
              color="success"
              onClick={handleSubmitContract}
              startIcon={
                isSubmitting ? (
                  <Iconify icon="eos-icons:loading" />
                ) : (
                  <Iconify icon="eva:checkmark-circle-2-fill" />
                )
              }
              fullWidth={isMobile}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Signed Contract"}
            </Button>
          )}
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
