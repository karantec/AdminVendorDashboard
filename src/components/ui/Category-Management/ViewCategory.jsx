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
  useMediaQuery
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowBack, CalendarToday, Update } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import Sidebar from "../../../layout/AppSidebar"; // Adjust path as needed

const ViewCategory = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // State for category
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Effect to handle responsive sidebar
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: { xs: 'column', md: 'row' } }}>
      <Sidebar open={sidebarOpen} onToggle={toggleSidebar} />

      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, sm: 3 },
          width: { xs: '100%', md: `calc(100% - ${sidebarOpen ? '240px' : '0px'})` },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Box 
          sx={{ 
            mb: 3, 
            display: 'flex', 
            alignItems: 'center',
            flexWrap: 'wrap'
          }}
        >
          <IconButton 
            onClick={handleBack} 
            sx={{ mr: 1 }}
            aria-label="Back"
          >
            <ArrowBack />
          </IconButton>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            component="h1"
            sx={{ 
              flexGrow: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
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
          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={12} md={4}>
              <Card 
                elevation={2}
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <CardMedia
                  component="img"
                  height={isMobile ? "200" : "300"}
                  image={category.imageUrl}
                  alt={category.name}
                  onClick={handleImageClick}
                  sx={{ 
                    cursor: "pointer", 
                    objectFit: "cover",
                    flexShrink: 0
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{ 
                      display: "flex", 
                      justifyContent: "center", 
                      mb: 2 
                    }}
                  >
                    <Chip
                      label={category.isActive ? "Active" : "Inactive"}
                      color={category.isActive ? "success" : "error"}
                      variant="outlined"
                      size={isMobile ? "small" : "medium"}
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
              <Card 
                elevation={2}
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography 
                    variant={isMobile ? "h6" : "h5"} 
                    gutterBottom
                    sx={{
                      fontWeight: 'bold',
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      pb: 1
                    }}
                  >
                    {category.name}
                  </Typography>

                  <Typography 
                    variant="subtitle1" 
                    gutterBottom 
                    sx={{ 
                      mt: 2,
                      fontWeight: 'medium'
                    }}
                  >
                    Description
                  </Typography>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: { xs: 1.5, sm: 2 }, 
                      mb: 3,
                      backgroundColor: theme.palette.background.default
                    }}
                  >
                    <Typography variant="body1">
                      {category.description}
                    </Typography>
                  </Paper>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        mb: 1
                      }}>
                        <CalendarToday fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
                        <Typography variant="subtitle1" gutterBottom sx={{ mb: 0 }}>
                          Created At
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ pl: 4 }}>
                        {new Date(category.createdAt).toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        mb: 1
                      }}>
                        <Update fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
                        <Typography variant="subtitle1" gutterBottom sx={{ mb: 0 }}>
                          Last Updated
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ pl: 4 }}>
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
          PaperProps={{
            sx: {
              m: { xs: 1, sm: 2, md: 3 },
              width: { xs: 'calc(100% - 16px)', sm: 'auto' },
              maxHeight: { xs: '80vh', sm: '85vh', md: '90vh' }
            }
          }}
        >
          <DialogTitle sx={{ 
            typography: { xs: 'h6', sm: 'h5' },
            py: { xs: 1.5, sm: 2 }
          }}>
            {category?.name} Image
          </DialogTitle>
          <DialogContent sx={{ p: { xs: 1, sm: 2 } }}>
            {category && (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  style={{
                    maxWidth: "100%",
                    maxHeight: isMobile ? "50vh" : "70vh",
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