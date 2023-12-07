import React from 'react'
import { TextField, Button, Typography } from '@mui/material'
import Magnify from 'mdi-material-ui/Magnify'
import InputAdornment from '@mui/material/InputAdornment'

function TextSearch(props) {
  return (
    <TextField
      {...props}
      size='small'
      fullWidth
      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
      InputProps={{
        startAdornment: (
          <InputAdornment position='start'>
            <Magnify fontSize='small' />
          </InputAdornment>
        ),
        endAdornment: props.buttonInside && (
          <>
            <Typography variant='body2' sx={{ color: 'gray' }}>
              |
            </Typography>
            <Button onClick={props.handleSearchButton} sx={{ px: 2, fontSize: 12 }}>
              Search
            </Button>
          </>
        )
      }}
    />
  )
}

export default TextSearch
