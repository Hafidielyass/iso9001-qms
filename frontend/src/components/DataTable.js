import React from 'react';
import {
  DataGrid,
  frFR,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarExport,
} from '@mui/x-data-grid';
import { Box, LinearProgress } from '@mui/material';

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

function DataTable({
  rows,
  columns,
  loading = false,
  pageSize = 10,
  checkboxSelection = false,
  onSelectionChange,
}) {
  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 20]}
        checkboxSelection={checkboxSelection}
        disableSelectionOnClick
        components={{
          Toolbar: CustomToolbar,
          LoadingOverlay: LinearProgress,
        }}
        onSelectionModelChange={onSelectionChange}
        localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
        sx={{
          '& .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
        }}
      />
    </Box>
  );
}

export default DataTable;
