import {
  Dialog,
  Typography,
  DialogContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  DialogActions,
  Checkbox,
  Button
} from '@mui/material'
import React from 'react'

function AddCurriculumModal({ open, handleClose, handleSubmit }) {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth={'lg'} fullWidth>
      <DialogContent sx={{ minHeight: 450 }}>
        <Typography variant='h6' sx={{ mt: 5, ml: 5 }}>
          Add new curriculum
        </Typography>
        <DialogContent sx={{ display: 'flex' }}>
          <Grid container spacing={6}>
            <Grid item sm={12} md={12} lg={6}>
              <TextField fullWidth label='Curriculum Name TH *' placeholder='Thai Only' />
            </Grid>
            <Grid item sm={12} md={12} lg={6}>
              <TextField fullWidth label='Curriculum Name EN *' placeholder='English Only' />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogContent sx={{ display: 'flex' }}>
          <Grid container spacing={6}>
            <Grid item sm={12} md={12} lg={6}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>Faculty *</InputLabel>
                <Select
                  label='Category'
                  defaultValue=''
                  id='form-layouts-separator-select'
                  labelId='form-layouts-separator-select-label'
                >
                  <MenuItem value='University 1'>* </MenuItem>
                  <MenuItem value='University 2'>** </MenuItem>
                  <MenuItem value='University 3'>*** </MenuItem>
                  <MenuItem value='University 4'>**** </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item sm={12} md={12} lg={6}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>Student Group *</InputLabel>
                <Select
                  label='Category'
                  defaultValue=''
                  id='form-layouts-separator-select'
                  labelId='form-layouts-separator-select-label'
                >
                  <MenuItem value='University 1'>* </MenuItem>
                  <MenuItem value='University 2'>** </MenuItem>
                  <MenuItem value='University 3'>*** </MenuItem>
                  <MenuItem value='University 4'>**** </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item sm={12} md={12} lg={6}>
              <TextField fullWidth label='Year *' placeholder='Number Only ' />
            </Grid>

            <Grid item sm={12} md={12} lg={3}>
              <FormGroup>
                <FormControlLabel control={<Checkbox defaultChecked />} label='Duplicate Subjects' />
              </FormGroup>
            </Grid>

            <Grid item sm={12} md={12} lg={3}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>From Curriculum *</InputLabel>
                <Select
                  disabled
                  label='Category'
                  defaultValue=''
                  id='form-layouts-separator-select'
                  labelId='form-layouts-separator-select-label'
                >
                  <MenuItem value='University 1'>* </MenuItem>
                  <MenuItem value='University 2'>** </MenuItem>
                  <MenuItem value='University 3'>*** </MenuItem>
                  <MenuItem value='University 4'>**** </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='secondary'>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddCurriculumModal
