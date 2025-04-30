import React, { useState, ChangeEvent } from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
  FormHelperText,
  OutlinedInput,
  InputAdornment,
  Chip,
  Avatar
} from '@mui/material';
import { Upload as UploadIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Types
interface Category {
  id: string;
  name: string;
}

interface ProductFormData {
  name: string;
  description: string;
  category: string;
  price: string;
  costPrice: string;
  quantity: string;
  unit: string;
  images: File[];
  tags: string[];
}

interface FormErrors {
  name?: string;
  description?: string;
  category?: string;
  price?: string;
  costPrice?: string;
  quantity?: string;
  unit?: string;
  images?: string;
}

// Dummy data
const categories: Category[] = [
  { id: '1', name: 'Fruits & Vegetables' },
  { id: '2', name: 'Dairy & Eggs' },
  { id: '3', name: 'Meat & Fish' },
  { id: '4', name: 'Bakery' },
  { id: '5', name: 'Beverages' },
  { id: '6', name: 'Snacks' },
];

const units = ['kg', 'g', 'lb', 'oz', 'l', 'ml', 'piece', 'pack'];

const AddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    category: '',
    price: '',
    costPrice: '',
    quantity: '',
    unit: '',
    images: [],
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value,
    }));
    
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name as string]: undefined,
      }));
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      // Validate file types and size
      const validFiles = files.filter(file => {
        const isValidType = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type);
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
        return isValidType && isValidSize;
      });
      
      if (validFiles.length !== files.length) {
        setErrors(prev => ({
          ...prev,
          images: 'Only JPEG/PNG/GIF images under 5MB are allowed',
        }));
      }
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...validFiles],
      }));
      
      // Create previews
      const newPreviews = validFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      images: newImages,
    }));
    
    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]); // Clean up memory
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const handleTagAdd = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput],
      }));
      setTagInput('');
    }
  };

  const handleTagDelete = (tagToDelete: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToDelete),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (parseFloat(formData.price) <= 0) newErrors.price = 'Price must be greater than 0';
    if (!formData.costPrice) newErrors.costPrice = 'Cost price is required';
    if (parseFloat(formData.costPrice) <= 0) newErrors.costPrice = 'Cost price must be greater than 0';
    if (!formData.quantity) newErrors.quantity = 'Quantity is required';
    if (parseFloat(formData.quantity) <= 0) newErrors.quantity = 'Quantity must be greater than 0';
    if (!formData.unit) newErrors.unit = 'Unit is required';
    if (formData.images.length === 0) newErrors.images = 'At least one image is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Here you would typically send the data to your backend API
      console.log('Form data:', formData);
      
      // For now, we'll just navigate back to product list
      navigate('/products');
      
      // In a real app, you would:
      // 1. Create FormData object for file uploads
      // 2. Send to your API endpoint
      // 3. Handle success/error responses
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link color="inherit" href="/dashboard" onClick={(e) => {
          e.preventDefault();
          navigate('/dashboard');
        }}>
          Dashboard
        </Link>
        <Link color="inherit" href="/products" onClick={(e) => {
          e.preventDefault();
          navigate('/products');
        }}>
          Product Management
        </Link>
        <Typography color="text.primary">Add New Product</Typography>
      </Breadcrumbs>
      
      {/* Page Title */}
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Add New Product
      </Typography>
      
      {/* Main Form */}
      <Paper sx={{ p: 3 }} component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Product Information */}
          <Grid item xs={12}>
            <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
              Product Information
            </Typography>
            <Divider />
          </Grid>
          
          {/* Name */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              required
            />
          </Grid>
          
          {/* Category */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required error={!!errors.category}>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                label="Category"
              >
                {categories.map(category => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
            </FormControl>
          </Grid>
          
          {/* Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
              multiline
              rows={4}
              required
            />
          </Grid>
          
          {/* Pricing */}
          <Grid item xs={12}>
            <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
              Pricing & Inventory
            </Typography>
            <Divider />
          </Grid>
          
          {/* Price */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Selling Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              error={!!errors.price}
              helperText={errors.price}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              required
            />
          </Grid>
          
          {/* Cost Price */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Cost Price"
              name="costPrice"
              type="number"
              value={formData.costPrice}
              onChange={handleChange}
              error={!!errors.costPrice}
              helperText={errors.costPrice}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              required
            />
          </Grid>
          
          {/* Quantity & Unit */}
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              error={!!errors.quantity}
              helperText={errors.quantity}
              required
            />
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl fullWidth required error={!!errors.unit}>
              <InputLabel>Unit</InputLabel>
              <Select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                label="Unit"
              >
                {units.map(unit => (
                  <MenuItem key={unit} value={unit}>
                    {unit}
                  </MenuItem>
                ))}
              </Select>
              {errors.unit && <FormHelperText>{errors.unit}</FormHelperText>}
            </FormControl>
          </Grid>
          
          {/* Images */}
          <Grid item xs={12}>
            <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
              Product Images
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {errors.images && (
              <FormHelperText error sx={{ mb: 2 }}>
                {errors.images}
              </FormHelperText>
            )}
            
            {/* Image Upload */}
            <Box sx={{ mb: 2 }}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="product-images-upload"
                type="file"
                multiple
                onChange={handleImageUpload}
              />
              <label htmlFor="product-images-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<UploadIcon />}
                >
                  Upload Images
                </Button>
              </label>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Upload at least one image (Max 5MB each)
              </Typography>
            </Box>
            
            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <Grid container spacing={2}>
                {imagePreviews.map((preview, index) => (
                  <Grid item key={index} xs={6} sm={4} md={3} lg={2}>
                    <Box sx={{ position: 'relative' }}>
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '120px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                        }}
                      />
                      <Button
                        size="small"
                        color="error"
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          minWidth: 'auto',
                          p: 0.5,
                          bgcolor: 'background.paper',
                        }}
                        onClick={() => removeImage(index)}
                      >
                        <DeleteIcon fontSize="small" />
                      </Button>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
          
          {/* Tags */}
          <Grid item xs={12}>
            <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
              Tags
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <TextField
                label="Add Tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTagAdd()}
                size="small"
              />
              <Button variant="outlined" onClick={handleTagAdd}>
                Add
              </Button>
            </Box>
            
            {formData.tags.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleTagDelete(tag)}
                    avatar={<Avatar>{tag[0].toUpperCase()}</Avatar>}
                  />
                ))}
              </Box>
            )}
          </Grid>
          
          {/* Form Actions */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/products')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                Save Product
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AddProductPage;