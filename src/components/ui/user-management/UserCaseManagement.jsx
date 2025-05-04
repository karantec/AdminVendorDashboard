import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  useTheme,
} from "@mui/material";
import {
  Search,
  FilterList,
  Assignment,
  CheckCircle,
  Cancel,
  Edit,
  Delete,
  Refresh,
} from "@mui/icons-material";

const UserCaseManagement = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Dummy data
  const dummyCases = [
    {
      id: "UC-001",
      title: "Login Issue",
      description: "User cannot login to the system",
      status: "Pending",
      priority: "High",
      createdAt: "2023-05-15",
      assignedTo: "John Doe",
      createdBy: "user123",
    },
    {
      id: "UC-002",
      title: "Payment Failure",
      description: "Payment gateway not responding",
      status: "In Progress",
      priority: "Critical",
      createdAt: "2023-05-14",
      assignedTo: "Jane Smith",
      createdBy: "user456",
    },
    {
      id: "UC-003",
      title: "Profile Update",
      description: "User cannot update profile picture",
      status: "Resolved",
      priority: "Medium",
      createdAt: "2023-05-10",
      assignedTo: "Mike Johnson",
      createdBy: "user789",
    },
    {
      id: "UC-004",
      title: "Dashboard Loading",
      description: "Dashboard takes too long to load",
      status: "Pending",
      priority: "High",
      createdAt: "2023-05-08",
      assignedTo: "Sarah Williams",
      createdBy: "user101",
    },
    {
      id: "UC-005",
      title: "Notification Issue",
      description: "User not receiving notifications",
      status: "Rejected",
      priority: "Low",
      createdAt: "2023-05-05",
      assignedTo: "John Doe",
      createdBy: "user202",
    },
  ];

  // Filter cases based on search and filters
  const filteredCases = dummyCases.filter((caseItem) => {
    const matchesSearch =
      caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || caseItem.status === statusFilter;
    const matchesPriority =
      priorityFilter === "All" || caseItem.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Case actions
  const handleViewCase = (caseItem) => {
    setSelectedCase(caseItem);
    setIsEditMode(false);
    setOpenDialog(true);
  };

  const handleEditCase = (caseItem) => {
    setSelectedCase(caseItem);
    setIsEditMode(true);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCase(null);
  };

  const handleSaveCase = () => {
    // In a real app, you would save to the backend here
    console.log("Case saved:", selectedCase);
    handleCloseDialog();
  };

  const handleDeleteCase = (caseId) => {
    // In a real app, you would delete from the backend here
    console.log("Case deleted:", caseId);
  };

  const handleStatusChange = (e) => {
    if (selectedCase) {
      setSelectedCase({
        ...selectedCase,
        status: e.target.value,
      });
    }
  };

  const handlePriorityChange = (e) => {
    if (selectedCase) {
      setSelectedCase({
        ...selectedCase,
        priority: e.target.value,
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "In Progress":
        return "info";
      case "Resolved":
        return "success";
      case "Rejected":
        return "error";
      default:
        return "default";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Low":
        return "success";
      case "Medium":
        return "info";
      case "High":
        return "warning";
      case "Critical":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          User Case Management
        </Typography>
        <Button variant="contained" startIcon={<Assignment />}>
          Create New Case
        </Button>
      </Box>

      {/* Filters and Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            variant="outlined"
            placeholder="Search cases..."
            size="small"
            InputProps={{
              startAdornment: <Search sx={{ mr: 1 }} />,
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1, maxWidth: 400 }}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="All">All Status</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Resolved">Resolved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={priorityFilter}
              label="Priority"
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <MenuItem value="All">All Priorities</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Critical">Critical</MenuItem>
            </Select>
          </FormControl>

          <Tooltip title="Reset Filters">
            <IconButton
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("All");
                setPriorityFilter("All");
              }}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* Cases Table */}
      <Paper sx={{ p: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Case ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCases
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((caseItem) => (
                  <TableRow key={caseItem.id}>
                    <TableCell>{caseItem.id}</TableCell>
                    <TableCell>
                      <Typography fontWeight="medium">
                        {caseItem.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {caseItem.description.substring(0, 50)}...
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={caseItem.status}
                        color={getStatusColor(caseItem.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={caseItem.priority}
                        color={getPriorityColor(caseItem.priority)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{caseItem.createdAt}</TableCell>
                    <TableCell>{caseItem.assignedTo}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleViewCase(caseItem)}
                            color="info"
                          >
                            <Assignment fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleEditCase(caseItem)}
                            color="primary"
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteCase(caseItem.id)}
                            color="error"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredCases.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Case Detail Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {isEditMode ? "Edit User Case" : "User Case Details"}
          {selectedCase && (
            <Chip
              label={selectedCase.status}
              color={getStatusColor(selectedCase.status)}
              size="small"
              sx={{ ml: 2 }}
            />
          )}
        </DialogTitle>
        <DialogContent dividers>
          {selectedCase && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box sx={{ display: "flex", gap: 3 }}>
                <TextField
                  label="Case ID"
                  value={selectedCase.id}
                  fullWidth
                  disabled
                />
                <TextField
                  label="Created At"
                  value={selectedCase.createdAt}
                  fullWidth
                  disabled
                />
              </Box>

              <TextField
                label="Title"
                value={selectedCase.title}
                fullWidth
                disabled={!isEditMode}
              />

              <TextField
                label="Description"
                value={selectedCase.description}
                multiline
                rows={4}
                fullWidth
                disabled={!isEditMode}
              />

              <Box sx={{ display: "flex", gap: 3 }}>
                <FormControl fullWidth disabled={!isEditMode}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={selectedCase.status}
                    label="Status"
                    onChange={handleStatusChange}
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Resolved">Resolved</MenuItem>
                    <MenuItem value="Rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth disabled={!isEditMode}>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={selectedCase.priority}
                    label="Priority"
                    onChange={handlePriorityChange}
                  >
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Critical">Critical</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ display: "flex", gap: 3 }}>
                <TextField
                  label="Created By"
                  value={selectedCase.createdBy}
                  fullWidth
                  disabled
                />
                <TextField
                  label="Assigned To"
                  value={selectedCase.assignedTo}
                  fullWidth
                  disabled={!isEditMode}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          {isEditMode && (
            <>
              <Button
                onClick={handleCloseDialog}
                color="error"
                startIcon={<Cancel />}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveCase}
                color="success"
                startIcon={<CheckCircle />}
                variant="contained"
              >
                Save Changes
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserCaseManagement;
