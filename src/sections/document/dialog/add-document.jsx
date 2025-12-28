import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { Iconify } from "src/components/iconify";
import { useState, useEffect } from "react";
import { useGetDocumentType } from "src/api/document";

export function AddDocumentDialog({ open, onClose, onSave, editingDocument }) {
  const [documentType, setDocumentType] = useState("");
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const { documentsType, documentTypeLoading } = useGetDocumentType();

  // Pre-fill form when editing
  useEffect(() => {
    if (editingDocument) {
      setDocumentType(editingDocument.document_type_id || editingDocument.document_type?.id || "");
    } else {
      setDocumentType("");
      setFile(null);
    }
  }, [editingDocument, open]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSave = () => {
    onSave({ documentType, file });
    handleClose();
  };

  const handleClose = () => {
    setDocumentType("");
    setFile(null);
    setDragActive(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "#114B46",
          borderRadius: 2,
          p: 1,
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#ffffff",
          pb: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {editingDocument ? "Edit Document" : "Add Document"}
        </Typography>
        <IconButton
          onClick={handleClose}
          sx={{
            color: "#ffffff",
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <Iconify icon="eva:close-fill" width={24} />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ px: 3 }}>
        {/* Document Type Dropdown */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body2"
            sx={{
              color: "#ffffff",
              mb: 1,
              fontWeight: 500,
            }}
          >
            Document Type <span style={{ color: "#ff5252" }}>*</span>
          </Typography>
          <FormControl fullWidth>
            <Select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              displayEmpty
              sx={{
                color: "#ffffff",
                bgcolor: "rgba(255, 255, 255, 0.05)",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#2BA597",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#5DC8B9",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#2BA597",
                },
                "& .MuiSelect-icon": {
                  color: "#ffffff",
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: "#114B46",
                    "& .MuiMenuItem-root": {
                      color: "#ffffff",
                      "&:hover": {
                        bgcolor: "rgba(43, 165, 151, 0.2)",
                      },
                      "&.Mui-selected": {
                        bgcolor: "rgba(43, 165, 151, 0.3)",
                        "&:hover": {
                          bgcolor: "rgba(43, 165, 151, 0.4)",
                        },
                      },
                    },
                  },
                },
              }}
            >
              <MenuItem value="" disabled>
                <em style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                  Select document type
                </em>
              </MenuItem>
              {documentsType.map((docType) => (
                <MenuItem key={docType.id} value={docType.id}>
                  {docType.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Upload File */}
        <Box>
          <Typography
            variant="body2"
            sx={{
              color: "#ffffff",
              mb: 1,
              fontWeight: 500,
            }}
          >
            Upload File {!editingDocument && <span style={{ color: "#ff5252" }}>*</span>}
          </Typography>
          <Box
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            sx={{
              border: "2px dashed",
              borderColor: dragActive ? "#2BA597" : "#4F8E88",
              borderRadius: 2,
              p: 4,
              textAlign: "center",
              bgcolor: dragActive
                ? "rgba(43, 165, 151, 0.05)"
                : "rgba(255, 255, 255, 0.02)",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: "#2BA597",
                bgcolor: "rgba(43, 165, 151, 0.05)",
              },
            }}
            onClick={() => document.getElementById("file-upload").click()}
          >
            <input
              id="file-upload"
              type="file"
              hidden
              onChange={handleFileChange}
              accept="image/*,.pdf,.doc,.docx"
            />
            {editingDocument && !file ? (
              <>
                <Box
                  component="img"
                  src={editingDocument.file_path}
                  alt="Current document"
                  sx={{
                    maxWidth: "100%",
                    maxHeight: 200,
                    mb: 1,
                    borderRadius: 1,
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: "#ffffff",
                    mb: 0.5,
                  }}
                >
                  Click to change file
                </Typography>
              </>
            ) : (
              <>
                <Iconify
                  icon="eva:cloud-upload-outline"
                  width={48}
                  height={48}
                  sx={{ color: "#5DC8B9", mb: 1 }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    color: "#ffffff",
                    mb: 0.5,
                  }}
                >
                  {file ? file.name : "Drag or upload file"}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  {file ? "Click to change file" : "Click to browse"}
                </Typography>
              </>
            )}
          </Box>
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 2 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderColor: "#FFB74D",
            color: "#FFB74D",
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            "&:hover": {
              borderColor: "#FFA726",
              bgcolor: "rgba(255, 183, 77, 0.1)",
            },
          }}
        >
          Discard
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!documentType || (!editingDocument && !file)}
          sx={{
            bgcolor: "#FFB74D",
            color: "#114B46",
            textTransform: "none",
            fontWeight: 600,
            px: 4,
            "&:hover": {
              bgcolor: "#FFA726",
            },
            "&:disabled": {
              bgcolor: "rgba(255, 183, 77, 0.3)",
              color: "rgba(255, 255, 255, 0.3)",
            },
          }}
        >
          {editingDocument ? "Update" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
