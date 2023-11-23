import React from 'react'
import { Button } from '@mui/material'

function Btn(props) {
  return (
    <Button
      {...props}
      sx={{
        width: props.width || '100%',
        bgcolor: 'primary.main',
        color: 'grey.50',
        '&:hover': {
          bgcolor: 'white',
          color: 'primary.main'
        }
      }}
      onClick={props.handleclick}
    >
      {props.label}
    </Button>
  )
}

export default Btn
