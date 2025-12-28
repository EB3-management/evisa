import {
  Box,
  Button,
  Card,
  CardMedia,
  Chip,
  IconButton,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  addDocuments,
  delDocument,
  updateDocuments,
  useGetDocument,
} from "src/api/document";
import { Iconify } from "src/components/iconify";
import { DashboardContent } from "src/layouts/dashboard";
import { fDateTime } from "src/utils/format-time";
import { AddDocumentDialog } from "../dialog/add-document";
import { useState } from "react";
import { toast } from "sonner";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { paths } from "src/routes/paths";

export function DocumentList() {
  const { documents, mutateDocument } = useGetDocument();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return { bgcolor: "#D2F3EE", color: "#2BA597" };
      case "rejected":
        return { bgcolor: "#FFE7E7", color: "#D32F2F" };
      case "pending":
      default:
        return { bgcolor: "#FFF4E5", color: "#F57C00" };
    }
  };

  const handleAddNew = () => {
    setEditingDocument(null);
    setOpenDialog(true);
  };

  const handleEdit = (doc) => {
    setEditingDocument(doc);
    setOpenDialog(true);
  };

  const handleSaveDocument = async ({ documentType, file }) => {
    try {
      const payload = {
        document_type_id: documentType.toString(),
      };

      // Only add file_path if a new file is provided
      if (file) {
        const base64 = await toBase64(file);
        payload.file_path = base64;
      }

      let response;
      if (editingDocument) {
        // Update existing document
        response = await updateDocuments(editingDocument.id, payload);
        toast.success(response.message || "Document updated successfully!");
      } else {
        // Add new document
        response = await addDocuments(payload);
        toast.success(response.message || "Document uploaded successfully!");
      }

      setOpenDialog(false);
      setEditingDocument(null);
      mutateDocument();
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        `Failed to ${editingDocument ? "update" : "upload"} document`;
      toast.error(message);
    }
  };

  // helper to convert file
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleDelete = (id) => {
    setDocumentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await delDocument(documentToDelete);
      toast.success("Document deleted successfully!");
      mutateDocument();
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete document";
      toast.error(message);
    } finally {
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    }
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        links={[
          { name: "Dashboard", href: paths.dashboard.root },
          {
            name: "Documents",
            href: paths.dashboard.documents.root,
          },
          { name: "List" },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Box>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          {/* <Typography
            variant="h4"
            sx={{
              color: "#114B46",
              fontWeight: 700,
            }}
          >
            Documents
          </Typography> */}
          <Button
            variant="outlined"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleAddNew}
            sx={{
              borderColor: "#2BA597",
              color: "#2BA597",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1,
              "&:hover": {
                borderColor: "#1D7E73",
                bgcolor: "rgba(43, 165, 151, 0.04)",
              },
            }}
          >
            Add new
          </Button>
        </Box>

        {/* Documents Grid */}
        <Grid container spacing={3}>
          {documents.map((doc) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={doc.id}>
              <Card
                sx={{
                  position: "relative",
                  borderRadius: 2,
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  border: "1px solid #D2F3EE",
                  "&:hover": {
                    boxShadow: "0 8px 24px rgba(43, 165, 151, 0.16)",
                    transform: "translateY(-4px)",
                  },
                }}
              >
                {/* Action Buttons */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    display: "flex",
                    gap: 1,
                    zIndex: 2,
                  }}
                >
                  <IconButton
                    onClick={() => handleEdit(doc)}
                    sx={{
                      bgcolor: "rgba(43, 165, 151, 0.9)",
                      color: "#fff",
                      "&:hover": {
                        bgcolor: "rgba(43, 165, 151, 1)",
                      },
                    }}
                    size="small"
                  >
                    <Iconify icon="eva:edit-2-fill" width={18} />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(doc.id)}
                    sx={{
                      bgcolor: "rgba(211, 47, 47, 0.9)",
                      color: "#fff",
                      "&:hover": {
                        bgcolor: "rgba(211, 47, 47, 1)",
                      },
                    }}
                    size="small"
                  >
                    <Iconify icon="eva:trash-2-fill" width={18} />
                  </IconButton>
                </Box>

                {/* Document Image */}
                <Box
                  sx={{
                    position: "relative",
                    paddingTop: "133.33%", // 3:4 aspect ratio
                    bgcolor: "#f5f5f5",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={doc.file_path}
                    alt={doc.document_type.name}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>

                {/* Document Info */}
                <Box sx={{ p: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: "#114B46",
                        fontWeight: 600,
                        textTransform: "capitalize",
                        flex: 1,
                      }}
                    >
                      {doc.document_type.name}
                    </Typography>
                    <Chip
                      label={doc.status}
                      size="small"
                      sx={{
                        ...getStatusColor(doc.status),
                        fontWeight: 500,
                        fontSize: 11,
                        height: 22,
                      }}
                    />
                  </Box>

                  <Typography
                    variant="caption"
                    sx={{
                      color: "#4F8E88",
                      display: "block",
                      mb: 0.5,
                    }}
                  >
                    Uploaded: {fDateTime(doc.uploaded_at)}
                  </Typography>

                  {doc.remark && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#4F8E88",
                        display: "block",
                        fontStyle: "italic",
                      }}
                    >
                      {doc.remark}
                    </Typography>
                  )}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Empty State */}
        {documents.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
            }}
          >
            <Iconify
              icon="eva:file-text-outline"
              width={64}
              height={64}
              sx={{ color: "#CDE2E0", mb: 2 }}
            />
            <Typography
              variant="h6"
              sx={{
                color: "#4F8E88",
                mb: 1,
              }}
            >
              No documents uploaded
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#4F8E88",
                mb: 3,
              }}
            >
              Get started by uploading your first document
            </Typography>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleAddNew}
              sx={{
                bgcolor: "#2BA597",
                color: "#ffffff",
                textTransform: "none",
                fontWeight: 600,
                px: 4,
                "&:hover": {
                  bgcolor: "#1D7E73",
                },
              }}
            >
              Upload Document
            </Button>
          </Box>
        )}
      </Box>

      <AddDocumentDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setEditingDocument(null);
        }}
        onSave={handleSaveDocument}
        editingDocument={editingDocument}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "#114B46",
            borderRadius: 2,
            p: 1,
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#ffffff",
            fontWeight: 600,
            pb: 2,
          }}
        >
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#ffffff" }}>
            Are you sure you want to delete this document?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
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
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            sx={{
              bgcolor: "#D32F2F",
              color: "#ffffff",
              textTransform: "none",
              fontWeight: 600,
              px: 4,
              "&:hover": {
                bgcolor: "#B71C1C",
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
