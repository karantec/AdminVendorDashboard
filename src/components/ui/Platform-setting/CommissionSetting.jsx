import React, { useState, useEffect } from "react";
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
  CircularProgress,
  useTheme,
  useMediaQuery,
  Container,
  IconButton,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { 
  Save, 
  Add, 
  Delete, 
  Edit, 
  ExpandMore,
  Store as StoreIcon
} from "@mui/icons-material";

const CommissionSetting = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [globalCommissionRate, setGlobalCommissionRate] = useState(10);
  const [enableStoreSpecific, setEnableStoreSpecific] = useState(false);
  const [processingFee, setProcessingFee] = useState(2.5);
  const [tieredCommission, setTieredCommission] = useState(false);

  const [storeCommissions, setStoreCommissions] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");

  const [editingTier, setEditingTier] = useState(null);
  const [newTier, setNewTier] = useState({
    minOrderValue: 0,
    maxOrderValue: null,
    commissionRate: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [expandedStore, setExpandedStore] = useState(null);

  const dummyStores = [
    { id: "1", name: "Fresh Mart" },
    { id: "2", name: "Grocery Palace" },
    { id: "3", name: "Quick Stop" },
    { id: "4", name: "Organic Heaven" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setStoreCommissions([
        {
          storeId: "1",
          storeName: "Fresh Mart",
          customCommission: true,
          commissionTiers: [
            {
              id: "1-1",
              minOrderValue: 0,
              maxOrderValue: 50,
              commissionRate: 8,
            },
            {
              id: "1-2",
              minOrderValue: 50,
              maxOrderValue: null,
              commissionRate: 6,
            },
          ],
        },
        {
          storeId: "2",
          storeName: "Grocery Palace",
          customCommission: false,
          commissionTiers: [],
        },
      ]);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSaveGlobalSettings = () => {
    setLoading(true);
    setTimeout(() => {
      setSuccess("Global commission settings saved successfully");
      setLoading(false);
    }, 800);
  };

  const handleAddStoreCommission = () => {
    if (!selectedStore) return;
    const store = dummyStores.find((s) => s.id === selectedStore);
    if (!store) return;

    if (storeCommissions.some((sc) => sc.storeId === selectedStore)) {
      setError("This store already has commission settings");
      return;
    }

    setStoreCommissions([
      ...storeCommissions,
      {
        storeId: selectedStore,
        storeName: store.name,
        customCommission: false,
        commissionTiers: [],
      },
    ]);
    setSelectedStore("");
  };

  const handleToggleStoreCommission = (storeId, enabled) => {
    setStoreCommissions(
      storeCommissions.map((sc) =>
        sc.storeId === storeId ? { ...sc, customCommission: enabled } : sc
      )
    );
  };

  const handleAddTier = (storeId) => {
    const store = storeCommissions.find((sc) => sc.storeId === storeId);
    if (!store) return;

    if (newTier.minOrderValue < 0 || newTier.commissionRate < 0) {
      setError("Values cannot be negative");
      return;
    }

    if (
      newTier.maxOrderValue !== null &&
      newTier.maxOrderValue <= newTier.minOrderValue
    ) {
      setError("Max order value must be greater than min order value");
      return;
    }

    const hasOverlap = store.commissionTiers.some((tier) => {
      return (
        (newTier.maxOrderValue === null ||
          tier.minOrderValue < newTier.maxOrderValue) &&
        (tier.maxOrderValue === null ||
          newTier.minOrderValue < tier.maxOrderValue)
      );
    });

    if (hasOverlap) {
      setError("This tier overlaps with an existing tier");
      return;
    }

    const tierId = `${storeId}-${Date.now()}`;
    const tierToAdd = { ...newTier, id: tierId };

    setStoreCommissions(
      storeCommissions.map((sc) =>
        sc.storeId === storeId
          ? {
              ...sc,
              commissionTiers: [...sc.commissionTiers, tierToAdd].sort(
                (a, b) => a.minOrderValue - b.minOrderValue
              ),
            }
          : sc
      )
    );

    setNewTier({ minOrderValue: 0, maxOrderValue: null, commissionRate: 0 });
  };

  const handleEditTier = (storeId, tier) => {
    setEditingTier(tier);
    setNewTier({
      minOrderValue: tier.minOrderValue,
      maxOrderValue: tier.maxOrderValue,
      commissionRate: tier.commissionRate,
    });
  };

  const handleUpdateTier = (storeId) => {
    if (!editingTier) return;

    setStoreCommissions(
      storeCommissions.map((sc) =>
        sc.storeId === storeId
          ? {
              ...sc,
              commissionTiers: sc.commissionTiers
                .map((t) =>
                  t.id === editingTier.id ? { ...newTier, id: t.id } : t
                )
                .sort((a, b) => a.minOrderValue - b.minOrderValue),
            }
          : sc
      )
    );

    setEditingTier(null);
    setNewTier({ minOrderValue: 0, maxOrderValue: null, commissionRate: 0 });
  };

  const handleDeleteTier = (storeId, tierId) => {
    setStoreCommissions(
      storeCommissions.map((sc) =>
        sc.storeId === storeId
          ? {
              ...sc,
              commissionTiers: sc.commissionTiers.filter(
                (t) => t.id !== tierId
              ),
            }
          : sc
      )
    );
  };

  const handleSaveStoreCommissions = () => {
    setLoading(true);
    setTimeout(() => {
      setSuccess("Store commission settings saved successfully");
      setLoading(false);
    }, 800);
  };

  const handleCloseAlert = () => {
    setError(null);
    setSuccess(null);
  };

  const handleStoreAccordionChange = (storeId) => (event, isExpanded) => {
    setExpandedStore(isExpanded ? storeId : null);
  };

  if (loading && storeCommissions.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box p={isMobile ? 1 : 3}>
        <Typography variant="h4" gutterBottom>
          Commission Settings
        </Typography>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={handleCloseAlert}
        >
          <Alert
            onClose={handleCloseAlert}
            severity="error"
            sx={{ width: "100%" }}
          >
            {error}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!success}
          autoHideDuration={6000}
          onClose={handleCloseAlert}
        >
          <Alert
            onClose={handleCloseAlert}
            severity="success"
            sx={{ width: "100%" }}
          >
            {success}
          </Alert>
        </Snackbar>

        {/* Global Commission Settings */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Global Commission Settings
            </Typography>
            
            <Grid container spacing={isMobile ? 2 : 3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Global Commission Rate (%)"
                  type="number"
                  value={globalCommissionRate}
                  onChange={(e) => setGlobalCommissionRate(Number(e.target.value))}
                  InputProps={{
                    inputProps: { min: 0, max: 100, step: 0.5 }
                  }}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Processing Fee (%)"
                  type="number"
                  value={processingFee}
                  onChange={(e) => setProcessingFee(Number(e.target.value))}
                  InputProps={{
                    inputProps: { min: 0, max: 100, step: 0.1 }
                  }}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={tieredCommission}
                      onChange={(e) => setTieredCommission(e.target.checked)}
                    />
                  }
                  label="Enable Tiered Commission"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={enableStoreSpecific}
                      onChange={(e) => setEnableStoreSpecific(e.target.checked)}
                    />
                  }
                  label="Enable Store-Specific Commissions"
                />
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

        {/* Store-Specific Commission Settings */}
        {enableStoreSpecific && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Store-Specific Commission Settings
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={isMobile ? 12 : 8}>
                  <FormControl fullWidth>
                    <InputLabel>Select Store</InputLabel>
                    <Select
                      value={selectedStore}
                      onChange={(e) => setSelectedStore(e.target.value)}
                      label="Select Store"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {dummyStores
                        .filter(
                          (store) =>
                            !storeCommissions.some(
                              (sc) => sc.storeId === store.id
                            )
                        )
                        .map((store) => (
                          <MenuItem key={store.id} value={store.id}>
                            {store.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={isMobile ? 12 : 4}>
                  <Button
                    fullWidth={isMobile}
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleAddStoreCommission}
                    disabled={!selectedStore}
                    sx={{ height: '100%' }}
                  >
                    Add Store
                  </Button>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Store Commission List */}
              {storeCommissions.length > 0 ? (
                isMobile ? (
                  // Mobile view: Accordion style
                  <Box>
                    {storeCommissions.map((store) => (
                      <Accordion 
                        key={store.storeId}
                        expanded={expandedStore === store.storeId}
                        onChange={handleStoreAccordionChange(store.storeId)}
                        sx={{ mb: 2 }}
                      >
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <StoreIcon color="primary" fontSize="small" />
                            <Typography variant="subtitle1">{store.storeName}</Typography>
                          </Stack>
                        </AccordionSummary>
                        <AccordionDetails>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={store.customCommission}
                                onChange={(e) =>
                                  handleToggleStoreCommission(
                                    store.storeId,
                                    e.target.checked
                                  )
                                }
                              />
                            }
                            label="Custom Commission Rate"
                          />
                          
                          {store.customCommission && (
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                Commission Tiers
                              </Typography>
                              
                              {store.commissionTiers.length > 0 ? (
                                <TableContainer component={Paper} sx={{ mb: 2 }}>
                                  <Table size="small">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>Min Value</TableCell>
                                        <TableCell>Max Value</TableCell>
                                        <TableCell>Rate (%)</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {store.commissionTiers.map((tier) => (
                                        <TableRow key={tier.id}>
                                          <TableCell>${tier.minOrderValue}</TableCell>
                                          <TableCell>
                                            {tier.maxOrderValue !== null
                                              ? `$${tier.maxOrderValue}`
                                              : "∞"}
                                          </TableCell>
                                          <TableCell>{tier.commissionRate}%</TableCell>
                                          <TableCell align="right">
                                            <IconButton
                                              size="small"
                                              onClick={() => handleEditTier(store.storeId, tier)}
                                            >
                                              <Edit fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                              size="small"
                                              onClick={() =>
                                                handleDeleteTier(store.storeId, tier.id)
                                              }
                                            >
                                              <Delete fontSize="small" />
                                            </IconButton>
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              ) : (
                                <Alert severity="info" sx={{ mb: 2 }}>
                                  No commission tiers added yet.
                                </Alert>
                              )}
                              
                              <Typography variant="subtitle2" gutterBottom>
                                {editingTier ? "Edit Tier" : "Add New Tier"}
                              </Typography>
                              
                              <Grid container spacing={2}>
                                <Grid item xs={6}>
                                  <TextField
                                    fullWidth
                                    size="small"
                                    label="Min Order Value ($)"
                                    type="number"
                                    value={newTier.minOrderValue}
                                    onChange={(e) =>
                                      setNewTier({
                                        ...newTier,
                                        minOrderValue: Number(e.target.value),
                                      })
                                    }
                                  />
                                </Grid>
                                <Grid item xs={6}>
                                  <TextField
                                    fullWidth
                                    size="small"
                                    label="Max Order Value ($)"
                                    type="number"
                                    value={newTier.maxOrderValue === null ? "" : newTier.maxOrderValue}
                                    onChange={(e) =>
                                      setNewTier({
                                        ...newTier,
                                        maxOrderValue: e.target.value === "" ? null : Number(e.target.value),
                                      })
                                    }
                                    placeholder="Leave empty for no maximum"
                                  />
                                </Grid>
                                <Grid item xs={6}>
                                  <TextField
                                    fullWidth
                                    size="small"
                                    label="Commission Rate (%)"
                                    type="number"
                                    value={newTier.commissionRate}
                                    onChange={(e) =>
                                      setNewTier({
                                        ...newTier,
                                        commissionRate: Number(e.target.value),
                                      })
                                    }
                                    InputProps={{
                                      inputProps: { min: 0, max: 100, step: 0.5 }
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={6}>
                                  {editingTier ? (
                                    <Button
                                      fullWidth
                                      variant="contained"
                                      color="primary"
                                      onClick={() => handleUpdateTier(store.storeId)}
                                    >
                                      Update Tier
                                    </Button>
                                  ) : (
                                    <Button
                                      fullWidth
                                      variant="contained"
                                      startIcon={<Add />}
                                      onClick={() => handleAddTier(store.storeId)}
                                    >
                                      Add Tier
                                    </Button>
                                  )}
                                </Grid>
                              </Grid>
                            </Box>
                          )}
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Box>
                ) : (
                  // Desktop/Tablet view: Table style
                  <TableContainer component={Paper} sx={{ mb: 3 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Store Name</TableCell>
                          <TableCell>Custom Commission</TableCell>
                          <TableCell>Commission Tiers</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {storeCommissions.map((store) => (
                          <TableRow key={store.storeId}>
                            <TableCell>{store.storeName}</TableCell>
                            <TableCell>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={store.customCommission}
                                    onChange={(e) =>
                                      handleToggleStoreCommission(
                                        store.storeId,
                                        e.target.checked
                                      )
                                    }
                                  />
                                }
                                label=""
                              />
                            </TableCell>
                            <TableCell>
                              {store.customCommission && (
                                <Box>
                                  {store.commissionTiers.length > 0 ? (
                                    <TableContainer component={Paper} variant="outlined">
                                      <Table size="small">
                                        <TableHead>
                                          <TableRow>
                                            <TableCell>Min Value</TableCell>
                                            <TableCell>Max Value</TableCell>
                                            <TableCell>Rate (%)</TableCell>
                                            <TableCell align="right">Actions</TableCell>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {store.commissionTiers.map((tier) => (
                                            <TableRow key={tier.id}>
                                              <TableCell>${tier.minOrderValue}</TableCell>
                                              <TableCell>
                                                {tier.maxOrderValue !== null
                                                  ? `$${tier.maxOrderValue}`
                                                  : "∞"}
                                              </TableCell>
                                              <TableCell>{tier.commissionRate}%</TableCell>
                                              <TableCell align="right">
                                                <IconButton
                                                  size="small"
                                                  onClick={() => handleEditTier(store.storeId, tier)}
                                                >
                                                  <Edit fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                  size="small"
                                                  onClick={() =>
                                                    handleDeleteTier(store.storeId, tier.id)
                                                  }
                                                >
                                                  <Delete fontSize="small" />
                                                </IconButton>
                                              </TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </TableContainer>
                                  ) : (
                                    <Typography variant="body2" color="text.secondary">
                                      No tiers defined
                                    </Typography>
                                  )}
                                  
                                  <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                      {editingTier ? "Edit Tier" : "Add New Tier"}
                                    </Typography>
                                    
                                    <Grid container spacing={2} alignItems="center">
                                      <Grid item xs={12} sm={2}>
                                        <TextField
                                          fullWidth
                                          size="small"
                                          label="Min Order Value ($)"
                                          type="number"
                                          value={newTier.minOrderValue}
                                          onChange={(e) =>
                                            setNewTier({
                                              ...newTier,
                                              minOrderValue: Number(e.target.value),
                                            })
                                          }
                                        />
                                      </Grid>
                                      <Grid item xs={12} sm={2}>
                                        <TextField
                                          fullWidth
                                          size="small"
                                          label="Max Order Value ($)"
                                          type="number"
                                          value={newTier.maxOrderValue === null ? "" : newTier.maxOrderValue}
                                          onChange={(e) =>
                                            setNewTier({
                                              ...newTier,
                                              maxOrderValue: e.target.value === "" ? null : Number(e.target.value),
                                            })
                                          }
                                          placeholder="Leave empty for no maximum"
                                        />
                                      </Grid>
                                      <Grid item xs={12} sm={2}>
                                        <TextField
                                          fullWidth
                                          size="small"
                                          label="Commission Rate (%)"
                                          type="number"
                                          value={newTier.commissionRate}
                                          onChange={(e) =>
                                            setNewTier({
                                              ...newTier,
                                              commissionRate: Number(e.target.value),
                                            })
                                          }
                                          InputProps={{
                                            inputProps: { min: 0, max: 100, step: 0.5 }
                                          }}
                                        />
                                      </Grid>
                                      <Grid item xs={12} sm={3}>
                                        {editingTier ? (
                                          <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleUpdateTier(store.storeId)}
                                          >
                                            Update Tier
                                          </Button>
                                        ) : (
                                          <Button
                                            variant="contained"
                                            startIcon={<Add />}
                                            onClick={() => handleAddTier(store.storeId)}
                                          >
                                            Add Tier
                                          </Button>
                                        )}
                                      </Grid>
                                    </Grid>
                                  </Box>
                                </Box>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )
              ) : (
                <Alert severity="info">No store-specific commission settings added yet.</Alert>
              )}
              
              {storeCommissions.length > 0 && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Save />}
                  onClick={handleSaveStoreCommissions}
                  disabled={loading}
                >
                  Save Store Settings
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
};

export default CommissionSetting;