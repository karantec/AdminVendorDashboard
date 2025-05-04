import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  IconButton,
  AppBar,
  Toolbar,
  CssBaseline,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";

// Dummy data for categories
const dummyCategories = [
  {
    _id: "1",
    name: "Fruits & Vegetables",
    description: "Fresh fruits and vegetables",
    parentCategory: null,
    isActive: true,
    createdAt: "2023-01-01",
  },
  {
    _id: "2",
    name: "Fruits",
    description: "Fresh fruits",
    parentCategory: "1",
    isActive: true,
    createdAt: "2023-01-01",
  },
  {
    _id: "3",
    name: "Vegetables",
    description: "Fresh vegetables",
    parentCategory: "1",
    isActive: true,
    createdAt: "2023-01-01",
  },
  {
    _id: "4",
    name: "Dairy & Eggs",
    description: "Milk, cheese, eggs and more",
    parentCategory: null,
    isActive: true,
    createdAt: "2023-01-02",
  },
];

const CategoryManagement = () => {
  const [categories, setCategories] = useState(dummyCategories);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parentCategory: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [errors, setErrors] = useState({
    name: "",
    description: "",
  });

  // Get top-level categories for parent category dropdown
  const topLevelCategories = categories.filter(
    (cat) => cat.parentCategory === null
  );

  // Form validation
  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: "",
      description: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
      valid = false;
    } else if (formData.name.length > 50) {
      newErrors.name = "Name must be less than 50 characters";
      valid = false;
    }

    if (formData.description.length > 200) {
      newErrors.description = "Description must be less than 200 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (editingId) {
        // Update existing category
        setCategories((prev) =>
          prev.map((cat) =>
            cat._id === editingId
              ? {
                  ...cat,
                  name: formData.name,
                  description: formData.description,
                  parentCategory: formData.parentCategory || null,
                }
              : cat
          )
        );
        setSnackbar({
          open: true,
          message: "Category updated successfully",
          severity: "success",
        });
      } else {
        // Add new category
        const newCategory = {
          _id: Math.random().toString(36).substring(2, 9),
          name: formData.name,
          description: formData.description,
          parentCategory: formData.parentCategory || null,
          isActive: true,
          createdAt: new Date().toISOString(),
        };
        setCategories((prev) => [...prev, newCategory]);
        setSnackbar({
          open: true,
          message: "Category added successfully",
          severity: "success",
        });
      }

      // Reset form
      setFormData({
        name: "",
        description: "",
        parentCategory: "",
      });
      setEditingId(null);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error saving category",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit action
  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      description: category.description,
      parentCategory: category.parentCategory || "",
    });
    setEditingId(category._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle delete action
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Check if category has subcategories
        const hasSubcategories = categories.some(
          (cat) => cat.parentCategory === id
        );
        if (hasSubcategories) {
          setSnackbar({
            open: true,
            message: "Cannot delete category with subcategories",
            severity: "warning",
          });
          return;
        }

        setCategories((prev) => prev.filter((cat) => cat._id !== id));
        setSnackbar({
          open: true,
          message: "Category deleted successfully",
          severity: "success",
        });

        if (editingId === id) {
          setFormData({
            name: "",
            description: "",
            parentCategory: "",
          });
          setEditingId(null);
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Error deleting category",
          severity: "error",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle toggle active status
  const handleToggleActive = async (id) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setCategories((prev) =>
        prev.map((cat) =>
          cat._id === id ? { ...cat, isActive: !cat.isActive } : cat
        )
      );

      setSnackbar({
        open: true,
        message: "Category status updated",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error updating category status",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Category Management
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: "64px", // To account for the AppBar
        }}
      >
        <Typography variant="h4" gutterBottom>
          {editingId ? "Edit Category" : "Add New Category"}
        </Typography>

        {/* Add/Edit Category Form */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Category Name *"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    disabled={isLoading}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Parent Category</InputLabel>
                    <Select
                      name="parentCategory"
                      value={formData.parentCategory}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          parentCategory: e.target.value,
                        }))
                      }
                      label="Parent Category"
                      disabled={isLoading || !!editingId}
                    >
                      <MenuItem value="">
                        <em>None (Top-level category)</em>
                      </MenuItem>
                      {topLevelCategories.map((category) => (
                        <MenuItem key={category._id} value={category._id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    multiline
                    rows={3}
                    error={!!errors.description}
                    helperText={errors.description}
                    disabled={isLoading}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
                  >
                    {editingId && (
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => {
                          setFormData({
                            name: "",
                            description: "",
                            parentCategory: "",
                          });
                          setEditingId(null);
                        }}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={isLoading}
                      startIcon={isLoading && <CircularProgress size={20} />}
                    >
                      {editingId ? "Update Category" : "Add Category"}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>

        {/* Categories Table */}
        <Paper sx={{ overflow: "hidden" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Parent Category</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell>
                      {category.parentCategory
                        ? category.parentCategory
                        : "None"}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleEdit(category)}
                        disabled={isLoading}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(category._id)}
                        disabled={isLoading}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleToggleActive(category._id)}
                        disabled={isLoading}
                      >
                        {category.isActive ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default CategoryManagement;
