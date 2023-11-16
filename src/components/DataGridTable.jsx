import React from 'react'
import { Box, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import CircleLoading from './CircleLoading'

function DataGridTable({ hidePagination, rows, columns, uniqueKey, isLoading, noData = 'ไม่มีข้อมูลในระบบ' }) {
  if (isLoading) {
    return (
      <Box sx={{ height: 120, m: 12 }}>
        <CircleLoading />
      </Box>
    )
  }
  // else if (rows?.length < 0) {
  //   return <Typography sx={{ m: 6 }}>{noData}</Typography>
  // }

  return !isLoading && rows?.length > 0 ? (
    <Box style={{ width: '100%' }}>
      <DataGrid
        rows={rows || ''}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 20 }
          }
        }}
        pageSizeOptions={[20, 50, 100]}
        disableRowSelectionOnClick
        getRowId={row => row[uniqueKey]}
        hideFooterPagination={hidePagination}
      />
    </Box>
  ) : (
    <Typography sx={{ m: 6, ml: 0 }}>{noData}</Typography>
  )
}

export default DataGridTable
