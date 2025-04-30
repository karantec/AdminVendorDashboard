import React from 'react';
import { Box, Button, Typography, Divider } from '@mui/material';
import { Delete, ToggleOn, ToggleOff } from '@mui/icons-material';

interface ProductActionsProps {
  selectedCount: number;
  onBulkAction: (action: 'activate' | 'deactivate' | 'delete') => void;
}

export const ProductActions: React.FC<ProductActionsProps> = ({
  selectedCount,
  onBulkAction
}) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle1">
          {selectedCount} product{selectedCount !== 1 ? 's' : ''} selected
        </Typography>
        <Box>
          <Button
            variant="outlined"
            color="success"
            startIcon={<ToggleOn />}
            disabled={selectedCount === 0}
            onClick={() => onBulkAction('activate')}
            sx={{ mr: 1 }}
          >
            Activate
          </Button>
          <Button
            variant="outlined"
            color="warning"
            startIcon={<ToggleOff />}
            disabled={selectedCount === 0}
            onClick={() => onBulkAction('deactivate')}
            sx={{ mr: 1 }}
          >
            Deactivate
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            disabled={selectedCount === 0}
            onClick={() => onBulkAction('delete')}
          >
            Delete
          </Button>
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />
    </Box>
  );
};