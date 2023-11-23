import React from 'react'
import TextField from '@mui/material/TextField'
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
        )
      }}
    />
  )
}

export default TextSearch
