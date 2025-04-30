import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Snackbar, Alert, Pagination, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Search, Edit, Delete, Save, Cancel, Add } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import Sidebar from '../../../layout/AppSidebar'; // Adjust import path as needed

// Types
type Product = {
  id: string;
  name: string;
  category: string;
  currentPrice: number;
  newPrice?: number;
  costPrice: number;
  stock: number;
  lastUpdated: string;
};

type Category = {
  id: string;
  name: string;
};

// Dummy data
const dummyProducts: Product[] = [
  { id: '1', name: 'Organic Apples', category: 'Fruits', currentPrice: 2.99, costPrice: 1.50, stock: 120, lastUpdated: '2023-05-15' },
  { id: '2', name: 'Whole Wheat Bread', category: 'Bakery', currentPrice: 3.49, costPrice: 1.80, stock: 85, lastUpdated: '2023-05-14' },
  { id: '3', name: 'Free Range Eggs (12pk)', category: 'Dairy', currentPrice: 4.99, costPrice: 2.50, stock: 60, lastUpdated: '2023-05-16' },
  { id: '4', name: 'Almond Milk', category: 'Dairy Alternatives', currentPrice: 3.29, costPrice: 1.75, stock: 45, lastUpdated: '2023-05-13' },
  { id: '5', name: 'Grass-Fed Beef (1lb)', category: 'Meat', currentPrice: 8.99, costPrice: 5.00, stock: 30, lastUpdated: '2023-05-16' },
  { id: '6', name: 'Organic Spinach', category: 'Vegetables', currentPrice: 2.49, costPrice: 1.20, stock: 75, lastUpdated: '2023-05-15' },
  { id: '7', name: 'Greek Yogurt', category: 'Dairy', currentPrice: 1.99, costPrice: 0.95, stock: 90, lastUpdated: '2023-05-14' },
  { id: '8', name: 'Quinoa', category: 'Grains', currentPrice: 4.49, costPrice: 2.25, stock: 50, lastUpdated: '2023-05-13' },
];

const categories: Category[] = [
  { id: '1', name: 'All Categories' },
  { id: '2', name: 'Fruits' },
  { id: '3', name: 'Vegetables' },
  { id: '4', name: 'Dairy' },
  { id: '5', name: 'Meat' },
  { id: '6', name: 'Bakery' },
  { id: '7', name: 'Grains' },
  { id: '8', name: 'Dairy Alternatives' },
];

const ProductPricingManagement: React.FC = () => {
  const theme = useTheme();
  const [products, setProducts] = useState<Product[]>(dummyProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(dummyProducts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('1');
  const [currentPage, setCurrentPage] = useState(1);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id' | 'lastUpdated'> & { id?: string, lastUpdated?: string }>({
    name: '',
    category: '',
    currentPrice: 0,
    costPrice: 0,
    stock: 0,
  });
  const [isAddingNew, setIsAddingNew] = useState(false);

  const itemsPerPage = 5;

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, products]);

  const filterProducts = () => {
    let result = [...products];
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory !== '1') {
      const categoryName = categories.find(cat => cat.id === selectedCategory)?.name;
      if (categoryName) {
        result = result.filter(product => product.category === categoryName);
      }
    }
    
    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    // Set newPrice to currentPrice for editing
    setProducts(products.map(product => 
      product.id === id ? { ...product, newPrice: product.currentPrice } : product
    ));
  };

  const handleSave = (id: string) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const updatedProducts = products.map(product => {
        if (product.id === id && product.newPrice !== undefined) {
          return {
            ...product,
            currentPrice: product.newPrice,
            lastUpdated: new Date().toISOString().split('T')[0],
            newPrice: undefined
          };
        }
        return product;
      });
      
      setProducts(updatedProducts);
      setEditingId(null);
      setLoading(false);
      showSnackbar('Price updated successfully!', 'success');
    }, 1000);
  };

  const handleCancel = () => {
    setEditingId(null);
    // Remove newPrice from all products
    setProducts(products.map(product => {
      const { newPrice, ...rest } = product;
      return rest;
    }));
  };

  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setProducts(products.filter(product => product.id !== productToDelete));
        setOpenDeleteDialog(false);
        setProductToDelete(null);
        setLoading(false);
        showSnackbar('Product deleted successfully!', 'success');
      }, 800);
    }
  };

  const handlePriceChange = (id: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setProducts(products.map(product => 
        product.id === id ? { ...product, newPrice: numValue } : product
      ));
    }
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setNewProduct({
      name: '',
      category: '',
      currentPrice: 0,
      costPrice: 0,
      stock: 0,
    });
  };

  const handleSaveNew = () => {
    if (!newProduct.name || !newProduct.category) {
      showSnackbar('Name and category are required!', 'error');
      return;
    }
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const addedProduct: Product = {
        ...newProduct,
        id: (products.length + 1).toString(),
        lastUpdated: new Date().toISOString().split('T')[0],
      };
      
      setProducts([...products, addedProduct]);
      setIsAddingNew(false);
      setLoading(false);
      showSnackbar('Product added successfully!', 'success');
    }, 1000);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: theme.palette.background.default }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4, color: theme.palette.text.primary }}>
          Product Pricing Management
        </Typography>
        
        {/* Filters and Search */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 250 }}
          />
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as string)}
                label="Category"
              >
                {categories.map(category => (
                  <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<Add />}
              onClick={handleAddNew}
              disabled={isAddingNew}
            >
              Add Product
            </Button>
          </Box>
        </Box>
        
        {/* Add New Product Form */}
        {isAddingNew && (
          <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: theme.palette.background.paper }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Add New Product
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 2 }}>
              <TextField
                label="Product Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                fullWidth
                size="small"
              />
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value as string})}
                  label="Category"
                >
                  {categories.filter(c => c.id !== '1').map(category => (
                    <MenuItem key={category.id} value={category.name}>{category.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Current Price"
                type="number"
                value={newProduct.currentPrice}
                onChange={(e) => setNewProduct({...newProduct, currentPrice: parseFloat(e.target.value) || 0})}
                fullWidth
                size="small"
                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
              />
              <TextField
                label="Cost Price"
                type="number"
                value={newProduct.costPrice}
                onChange={(e) => setNewProduct({...newProduct, costPrice: parseFloat(e.target.value) || 0})}
                fullWidth
                size="small"
                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
              />
              <TextField
                label="Stock Quantity"
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value) || 0})}
                fullWidth
                size="small"
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
              <Button 
                variant="outlined" 
                onClick={() => setIsAddingNew(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                onClick={handleSaveNew}
                disabled={loading}
              >
                Save Product
              </Button>
            </Box>
          </Paper>
        )}
        
        {/* Products Table */}
        <Paper elevation={3} sx={{ backgroundColor: theme.palette.background.paper }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Current Price</TableCell>
                  <TableCell align="right">New Price</TableCell>
                  <TableCell align="right">Cost Price</TableCell>
                  <TableCell align="right">Stock</TableCell>
                  <TableCell align="right">Last Updated</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell align="right">${product.currentPrice.toFixed(2)}</TableCell>
                      <TableCell align="right">
                        {editingId === product.id ? (
                          <TextField
                            type="number"
                            value={product.newPrice || ''}
                            onChange={(e) => handlePriceChange(product.id, e.target.value)}
                            size="small"
                            sx={{ width: 100 }}
                            InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                          />
                        ) : (
                          `$${product.currentPrice.toFixed(2)}`
                        )}
                      </TableCell>
                      <TableCell align="right">${product.costPrice.toFixed(2)}</TableCell>
                      <TableCell align="right">{product.stock}</TableCell>
                      <TableCell align="right">{product.lastUpdated}</TableCell>
                      <TableCell align="center">
                        {editingId === product.id ? (
                          <>
                            <IconButton 
                              color="primary" 
                              onClick={() => handleSave(product.id)}
                              disabled={loading}
                            >
                              {loading ? <CircularProgress size={24} /> : <Save />}
                            </IconButton>
                            <IconButton color="secondary" onClick={handleCancel}>
                              <Cancel />
                            </IconButton>
                          </>
                        ) : (
                          <>
                            <IconButton color="primary" onClick={() => handleEdit(product.id)}>
                              <Edit />
                            </IconButton>
                            <IconButton color="error" onClick={() => handleDeleteClick(product.id)}>
                              <Delete />
                            </IconButton>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No products found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Pagination */}
          {filteredProducts.length > itemsPerPage && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, page) => setCurrentPage(page)}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </Paper>
        
        {/* Delete Confirmation Dialog */}
        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this product? This action cannot be undone.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)} disabled={loading}>
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteConfirm} 
              color="error" 
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default ProductPricingManagement;