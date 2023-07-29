import React from 'react'
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
  DialogActions,
  Button
} from '@mui/material'

import Icon from '@mdi/react'
import { mdiSitemapOutline } from '@mdi/js'
import { mdiPen } from '@mdi/js/'
import { mdiDelete } from '@mdi/js'

function CurriculumEditModal({ open, handleClose, handleUpdate }) {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth={'lg'} fullWidth>
      <DialogContent sx={{ minHeight: 450 }}>
        <Grid container>
          <Grid container item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', m: 6 }}>
            <Grid item xs={3}>
              <Typography variant='h6'>Curriculum edit</Typography>
            </Grid>
            <Grid container item xs={8} spacing={2} justifyContent={'end'}>
              <Grid item>
                <Button color='secondary' variant='outlined' startIcon={<Icon path={mdiSitemapOutline} size={0.75} />}>
                  Curriculum Structure
                </Button>
              </Grid>
              <Grid item>
                <Button color='secondary' variant='outlined' startIcon={<Icon path={mdiPen} size={0.75} />}>
                  Subject Management
                </Button>
              </Grid>
              <Grid item>
                <Button
                  color='error'
                  variant='outlined'
                  startIcon={<Icon bgcolor='red' path={mdiDelete} size={0.75} />}
                >
                  Delete
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <DialogContent sx={{ display: 'flex' }}>
          <Grid container spacing={6}>
            <Grid item sm={12} md={12} lg={6}>
              <TextField fullWidth label='Curriculum Name TH *' placeholder='Thai Only and Number' />
            </Grid>
            <Grid item sm={12} md={12} lg={6}>
              <TextField fullWidth label='Curriculum Name EN *' placeholder='English Only and Number' />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogContent sx={{ display: 'flex' }}>
          <Grid container spacing={6}>
            <Grid item sm={12} md={12} lg={3}>
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
            <Grid item sm={12} md={12} lg={3}>
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
          </Grid>
        </DialogContent>
        {/* <DialogContent sx={{ display: 'flex' }}></DialogContent> */}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='secondary'>
          Cancel
        </Button>
        <Button onClick={handleUpdate}>Update</Button>
      </DialogActions>
    </Dialog>
  )
}

export default CurriculumEditModal
