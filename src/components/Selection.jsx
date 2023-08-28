import React from 'react'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

function Selection({ label, firstItemText, selectionValue, Items, handleChange, height, width, disabled }) {
  return (
    <FormControl sx={{ width: width }}>
      <InputLabel size='small' id='form-layouts-separator-select-label'>
        {label}
      </InputLabel>
      <Select
        size='small'
        disabled={disabled}
        sx={{ height: height }}
        label={label}
        value={selectionValue}
        onChange={handleChange}
      >
        <MenuItem value={0}>{firstItemText}</MenuItem>
        {Items}
        {/* sample items
        <MenuItem value='University 1'>University 1</MenuItem>
        <MenuItem value='University 2'>University 2</MenuItem>
        <MenuItem value='University 3'>University 3</MenuItem>
        <MenuItem value='University 4'>University 4</MenuItem> */}
      </Select>
    </FormControl>
  )
}

export default Selection
