import React from 'react'
import { Box, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import CircleLoading from './CircleLoading'

function DataGridTable({ rows, columns, uniqueKey, isLoading }) {
  if (!isLoading) {
    if (rows.length < 1) {
      return <Typography sx={{ m: 6 }}>ไม่มีข้อมูลในระบบ</Typography>
    }
  } else {
    return (
      <Box sx={{ height: 120, m: 12 }}>
        <CircleLoading />
      </Box>
    )
  }

  return (
    <Box style={{ width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 20 }
          }
        }}
        pageSizeOptions={[20, 50, 100]}
        disableRowSelectionOnClick
        getRowId={row => row[uniqueKey]}
      />
    </Box>
  )
}

export default DataGridTable
