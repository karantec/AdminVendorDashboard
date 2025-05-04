import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Typography,
  Alert,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import Sidebar from "../../../layout/AppSidebar"; // Adjust path as needed

const ViewCategory = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();

  // State for category
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  // Fetch category data (replace with API call in real implementation)
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Dummy data - in a real app, this would come from an API
        const dummyCategories = [
          {
            id: "1",
            name: "Fruits",
            description: "Fresh fruits and vegetables",
            imageUrl: "https://via.placeholder.com/600x400?text=Fruits",
            isActive: true,
            createdAt: "2023-01-01T10:00:00Z",
            updatedAt: "2023-01-01T10:00:00Z",
          },
          {
            id: "2",
            name: "Dairy",
            description: "Milk, cheese, and other dairy products",
            imageUrl: "https://via.placeholder.com/600x400?text=Dairy",
            isActive: true,
            createdAt: "2023-01-02T11:00:00Z",
            updatedAt: "2023-01-05T09:00:00Z",
          },
          {
            id: "3",
            name: "Bakery",
            description: "Bread, cakes, and pastries",
            imageUrl: "https://via.placeholder.com/600x400?text=Bakery",
            isActive: false,
            createdAt: "2023-01-03T12:00:00Z",
            updatedAt: "2023-01-10T15:00:00Z",
          },
        ];

        const foundCategory = dummyCategories.find((cat) => cat.id === id);

        if (foundCategory) {
          setCategory(foundCategory);
        } else {
          setError("Category not found");
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch category details");
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleImageClick = () => {
    setImageDialogOpen(true);
  };

  const handleCloseImageDialog = () => {
    setImageDialogOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <IconButton onClick={handleBack} sx={{ mr: 1 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="span">
            Category Details
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : category ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="300"
                  image={category.imageUrl}
                  alt={category.name}
                  onClick={handleImageClick}
                  sx={{ cursor: "pointer", objectFit: "cover" }}
                />
                <CardContent>
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mb: 2 }}
                  >
                    <Chip
                      label={category.isActive ? "Active" : "Inactive"}
                      color={category.isActive ? "success" : "error"}
                      variant="outlined"
                      size="medium"
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    Category ID: {category.id}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {category.name}
                  </Typography>

                  <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                    Description
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                    <Typography variant="body1">
                      {category.description}
                    </Typography>
                  </Paper>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        Created At
                      </Typography>
                      <Typography variant="body1">
                        {new Date(category.createdAt).toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        Last Updated
                      </Typography>
                      <Typography variant="body1">
                        {new Date(category.updatedAt).toLocaleString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : null}

        {/* Image Preview Dialog */}
        <Dialog
          open={imageDialogOpen}
          onClose={handleCloseImageDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>{category?.name} Image</DialogTitle>
          <DialogContent>
            {category && (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "70vh",
                    objectFit: "contain",
                  }}
                />
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ViewCategory;
