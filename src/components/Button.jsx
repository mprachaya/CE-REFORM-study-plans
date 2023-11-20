import React from 'react'
import { Button } from '@mui/material'

function Btn(props) {
  return (
    <Button
      {...props}
      sx={{
        width: props.width,
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
