import React from 'react'
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'

function Selection() {
  return (
    <FormControl>
      <InputLabel sx={{ m: -2 }} id='form-layouts-separator-select-label'>
        Faculty
      </InputLabel>
      <Select
        sx={{ height: 40 }}
        label='Country'
        defaultValue=''
        id='form-layouts-separator-select'
        labelId='form-layouts-separator-select-label'
      >
        <MenuItem value='University 1'>University 1</MenuItem>
        <MenuItem value='University 2'>University 2</MenuItem>
        <MenuItem value='University 3'>University 3</MenuItem>
        <MenuItem value='University 4'>University 4</MenuItem>
      </Select>
    </FormControl>
  )
}

export default Selection
