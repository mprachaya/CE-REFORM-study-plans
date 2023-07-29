import React from 'react'
import { Button } from '@mui/material'

function Btn({ handleClick }) {
  return (
    <Button
      sx={{
        bgcolor: 'primary.main',
        color: 'grey.50',
        '&:hover': {
          bgcolor: 'white',
          color: 'primary.main'
        }
      }}
      onClick={handleClick}
    >
      Add New
    </Button>
  )
}

export default Btn
