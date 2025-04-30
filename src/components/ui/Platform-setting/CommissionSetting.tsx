import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { Save, Add, Delete, Edit } from '@mui/icons-material';

interface CommissionTier {
  id: string;
  minOrderValue: number;
  maxOrderValue: number | null;
  commissionRate: number;
}

interface StoreCommission {
  storeId: string;
  storeName: string;
  customCommission: boolean;
  commissionTiers: CommissionTier[];
}

const CommissionSetting: React.FC = () => {
  // State for global commission settings
  const [globalCommissionRate, setGlobalCommissionRate] = useState<number>(10);
  const [enableStoreSpecific, setEnableStoreSpecific] = useState<boolean>(false);
  const [processingFee, setProcessingFee] = useState<number>(2.5);
  const [tieredCommission, setTieredCommission] = useState<boolean>(false);
  
  // State for store-specific commissions
  const [storeCommissions, setStoreCommissions] = useState<StoreCommission[]>([]);
  const [selectedStore, setSelectedStore] = useState<string>('');
  
  // State for editing tiers
  const [editingTier, setEditingTier] = useState<CommissionTier | null>(null);
  const [newTier, setNewTier] = useState<Omit<CommissionTier, 'id'>>({
    minOrderValue: 0,
    maxOrderValue: null,
    commissionRate: 0
  });
  
  // UI state
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Dummy stores data - in a real app, this would come from an API
  const dummyStores = [
    { id: '1', name: 'Fresh Mart' },
    { id: '2', name: 'Grocery Palace' },
    { id: '3', name: 'Quick Stop' },
    { id: '4', name: 'Organic Heaven' },
  ];

  // Load dummy data on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      // Simulate API call
      setStoreCommissions([
        {
          storeId: '1',
          storeName: 'Fresh Mart',
          customCommission: true,
          commissionTiers: [
            { id: '1-1', minOrderValue: 0, maxOrderValue: 50, commissionRate: 8 },
            { id: '1-2', minOrderValue: 50, maxOrderValue: null, commissionRate: 6 }
          ]
        },
        {
          storeId: '2',
          storeName: 'Grocery Palace',
          customCommission: false,
          commissionTiers: []
        }
      ]);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSaveGlobalSettings = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSuccess('Global commission settings saved successfully');
      setLoading(false);
    }, 800);
  };

  const handleAddStoreCommission = () => {
    if (!selectedStore) return;
    
    const store = dummyStores.find(s => s.id === selectedStore);
    if (!store) return;
    
    // Check if commission already exists for this store
    if (storeCommissions.some(sc => sc.storeId === selectedStore)) {
      setError('This store already has commission settings');
      return;
    }
    
    setStoreCommissions([
      ...storeCommissions,
      {
        storeId: selectedStore,
        storeName: store.name,
        customCommission: false,
        commissionTiers: []
      }
    ]);
    setSelectedStore('');
  };

  const handleToggleStoreCommission = (storeId: string, enabled: boolean) => {
    setStoreCommissions(storeCommissions.map(sc => 
      sc.storeId === storeId 
        ? { ...sc, customCommission: enabled } 
        : sc
    ));
  };

  const handleAddTier = (storeId: string) => {
    const store = storeCommissions.find(sc => sc.storeId === storeId);
    if (!store) return;
    
    // Validate the new tier
    if (newTier.minOrderValue < 0 || newTier.commissionRate < 0) {
      setError('Values cannot be negative');
      return;
    }
    
    if (newTier.maxOrderValue !== null && newTier.maxOrderValue <= newTier.minOrderValue) {
      setError('Max order value must be greater than min order value');
      return;
    }
    
    // Check for overlapping tiers
    const hasOverlap = store.commissionTiers.some(tier => {
      return (
        (newTier.maxOrderValue === null || tier.minOrderValue < newTier.maxOrderValue) &&
        (tier.maxOrderValue === null || newTier.minOrderValue < tier.maxOrderValue)
      );
    });
    
    if (hasOverlap) {
      setError('This tier overlaps with an existing tier');
      return;
    }
    
    const tierId = `${storeId}-${Date.now()}`;
    const tierToAdd = { ...newTier, id: tierId };
    
    setStoreCommissions(storeCommissions.map(sc => 
      sc.storeId === storeId 
        ? { ...sc, commissionTiers: [...sc.commissionTiers, tierToAdd].sort((a, b) => a.minOrderValue - b.minOrderValue) } 
        : sc
    ));
    
    setNewTier({
      minOrderValue: 0,
      maxOrderValue: null,
      commissionRate: 0
    });
  };

  const handleEditTier = (storeId: string, tier: CommissionTier) => {
    setEditingTier(tier);
    setNewTier({
      minOrderValue: tier.minOrderValue,
      maxOrderValue: tier.maxOrderValue,
      commissionRate: tier.commissionRate
    });
  };

  const handleUpdateTier = (storeId: string) => {
    if (!editingTier) return;
    
    setStoreCommissions(storeCommissions.map(sc => 
      sc.storeId === storeId 
        ? { 
            ...sc, 
            commissionTiers: sc.commissionTiers
              .map(t => t.id === editingTier.id ? { ...newTier, id: t.id } : t)
              .sort((a, b) => a.minOrderValue - b.minOrderValue)
          } 
        : sc
    ));
    
    setEditingTier(null);
    setNewTier({
      minOrderValue: 0,
      maxOrderValue: null,
      commissionRate: 0
    });
  };

  const handleDeleteTier = (storeId: string, tierId: string) => {
    setStoreCommissions(storeCommissions.map(sc => 
      sc.storeId === storeId 
        ? { ...sc, commissionTiers: sc.commissionTiers.filter(t => t.id !== tierId) } 
        : sc
    ));
  };

  const handleSaveStoreCommissions = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSuccess('Store commission settings saved successfully');
      setLoading(false);
    }, 800);
  };

  const handleCloseAlert = () => {
    setError(null);
    setSuccess(null);
  };

  if (loading && storeCommissions.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Commission Settings
      </Typography>
      
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      
      <Snackbar open={!!success} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>

      {/* Global Commission Settings */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Global Commission Settings
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={tieredCommission}
                    onChange={(e) => setTieredCommission(e.target.checked)}
                    color="primary"
                  />
                }
                label="Enable Tiered Commission"
              />
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {tieredCommission 
                  ? "Commission rates will vary based on order value tiers"
                  : "A flat commission rate will be applied to all orders"}
              </Typography>
            </Grid>
            
            {!tieredCommission && (
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Global Commission Rate (%)"
                  type="number"
                  fullWidth
                  value={globalCommissionRate}
                  onChange={(e) => setGlobalCommissionRate(Number(e.target.value))}
                  InputProps={{ endAdornment: '%' }}
                />
              </Grid>
            )}
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Processing Fee (%)"
                type="number"
                fullWidth
                value={processingFee}
                onChange={(e) => setProcessingFee(Number(e.target.value))}
                InputProps={{ endAdornment: '%' }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={enableStoreSpecific}
                    onChange={(e) => setEnableStoreSpecific(e.target.checked)}
                    color="primary"
                  />
                }
                label="Enable Store-Specific Commissions"
              />
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {enableStoreSpecific 
                  ? "You can set custom commission rates for individual stores"
                  : "All stores will use the global commission rate"}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Save />}
                onClick={handleSaveGlobalSettings}
                disabled={loading}
              >
                Save Global Settings
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Store-Specific Commissions */}
      {enableStoreSpecific && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Store-Specific Commission Settings
            </Typography>
            
            <Grid container spacing={3} alignItems="center" sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Select Store</InputLabel>
                  <Select
                    value={selectedStore}
                    onChange={(e) => setSelectedStore(e.target.value as string)}
                    label="Select Store"
                  >
                    {dummyStores
                      .filter(store => !storeCommissions.some(sc => sc.storeId === store.id))
                      .map(store => (
                        <MenuItem key={store.id} value={store.id}>
                          {store.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<Add />}
                  onClick={handleAddStoreCommission}
                  disabled={!selectedStore}
                >
                  Add Store
                </Button>
              </Grid>
            </Grid>
            
            {storeCommissions.map((storeCommission) => (
              <Box key={storeCommission.storeId} sx={{ mb: 4 }}>
                <Divider sx={{ my: 3 }} />
                
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="subtitle1">
                    {storeCommission.storeName}
                  </Typography>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={storeCommission.customCommission}
                        onChange={(e) => handleToggleStoreCommission(
                          storeCommission.storeId, 
                          e.target.checked
                        )}
                        color="primary"
                      />
                    }
                    label="Custom Commission"
                  />
                </Box>
                
                {storeCommission.customCommission ? (
                  <>
                    {tieredCommission ? (
                      <>
                        <TableContainer component={Paper} sx={{ mb: 3 }}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Min Order Value ($)</TableCell>
                                <TableCell>Max Order Value ($)</TableCell>
                                <TableCell>Commission Rate (%)</TableCell>
                                <TableCell>Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {storeCommission.commissionTiers.map((tier) => (
                                <TableRow key={tier.id}>
                                  <TableCell>${tier.minOrderValue.toFixed(2)}</TableCell>
                                  <TableCell>
                                    {tier.maxOrderValue !== null 
                                      ? `$${tier.maxOrderValue.toFixed(2)}` 
                                      : 'No limit'}
                                  </TableCell>
                                  <TableCell>{tier.commissionRate}%</TableCell>
                                  <TableCell>
                                    <Button
                                      size="small"
                                      startIcon={<Edit />}
                                      onClick={() => handleEditTier(storeCommission.storeId, tier)}
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      size="small"
                                      startIcon={<Delete />}
                                      onClick={() => handleDeleteTier(storeCommission.storeId, tier.id)}
                                      color="error"
                                      sx={{ ml: 1 }}
                                    >
                                      Delete
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                        
                        <Typography variant="subtitle2" gutterBottom>
                          {editingTier ? 'Edit Tier' : 'Add New Tier'}
                        </Typography>
                        
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} sm={3}>
                            <TextField
                              label="Min Order Value ($)"
                              type="number"
                              fullWidth
                              value={newTier.minOrderValue}
                              onChange={(e) => setNewTier({
                                ...newTier,
                                minOrderValue: Number(e.target.value)
                              })}
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={3}>
                            <TextField
                              label="Max Order Value ($)"
                              type="number"
                              fullWidth
                              value={newTier.maxOrderValue || ''}
                              onChange={(e) => setNewTier({
                                ...newTier,
                                maxOrderValue: e.target.value ? Number(e.target.value) : null
                              })}
                              placeholder="Leave empty for no limit"
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={3}>
                            <TextField
                              label="Commission Rate (%)"
                              type="number"
                              fullWidth
                              value={newTier.commissionRate}
                              onChange={(e) => setNewTier({
                                ...newTier,
                                commissionRate: Number(e.target.value)
                              })}
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={3}>
                            {editingTier ? (
                              <>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() => handleUpdateTier(storeCommission.storeId)}
                                  sx={{ mr: 1 }}
                                >
                                  Update
                                </Button>
                                <Button
                                  variant="outlined"
                                  onClick={() => {
                                    setEditingTier(null);
                                    setNewTier({
                                      minOrderValue: 0,
                                      maxOrderValue: null,
                                      commissionRate: 0
                                    });
                                  }}
                                >
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <Button
                                variant="contained"
                                color="primary"
                                startIcon={<Add />}
                                onClick={() => handleAddTier(storeCommission.storeId)}
                              >
                                Add Tier
                              </Button>
                            )}
                          </Grid>
                        </Grid>
                      </>
                    ) : (
                      <TextField
                        label="Commission Rate (%)"
                        type="number"
                        value={
                          storeCommission.commissionTiers.length > 0 
                            ? storeCommission.commissionTiers[0].commissionRate 
                            : globalCommissionRate
                        }
                        onChange={(e) => {
                          // For non-tiered, we'll just use the first tier if it exists
                          if (storeCommission.commissionTiers.length > 0) {
                            setStoreCommissions(storeCommissions.map(sc => 
                              sc.storeId === storeCommission.storeId 
                                ? { 
                                    ...sc, 
                                    commissionTiers: [
                                      { 
                                        ...sc.commissionTiers[0], 
                                        commissionRate: Number(e.target.value) 
                                      }
                                    ] 
                                  } 
                                : sc
                            ));
                          } else {
                            setStoreCommissions(storeCommissions.map(sc => 
                              sc.storeId === storeCommission.storeId 
                                ? { 
                                    ...sc, 
                                    commissionTiers: [
                                      { 
                                        id: `${sc.storeId}-${Date.now()}`, 
                                        minOrderValue: 0, 
                                        maxOrderValue: null, 
                                        commissionRate: Number(e.target.value) 
                                      }
                                    ] 
                                  } 
                                : sc
                            ));
                          }
                        }}
                        sx={{ width: 200 }}
                      />
                    )}
                  </>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    Using global commission settings
                  </Typography>
                )}
              </Box>
            ))}
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<Save />}
              onClick={handleSaveStoreCommissions}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              Save Store Commissions
            </Button>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default CommissionSetting;