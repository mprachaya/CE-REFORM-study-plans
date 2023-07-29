import React from 'react'
import { Dialog, Typography, Grid, TextField, DialogActions, Button, InputAdornment } from '@mui/material'
import Magnify from 'mdi-material-ui/Magnify'
import DataGridTable from 'src/components/DataGridTable'

function CurriculumDetailsModal({ open, handleClose, rows_details, columns_details }) {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth={'lg'} fullWidth>
      <Grid container>
        <Grid xs={12} item sx={{ mt: 10, ml: 10 }}>
          <Typography variant='h6'>Curriculums Details</Typography>
        </Grid>
        <Grid xs={12} container sx={{ mt: 4, mb: 6, ml: 10 }}>
          <Grid item direction={'column'} xs={6}>
            <Grid container>
              <Grid item xs={8} sm={6} md={5} lg={3}>
                <Typography variant='body2' sx={{ minWidth: 120 }}>
                  Curriculum (TH) :
                </Typography>
              </Grid>
              <Grid item xs={4} sm={6} md={2.5} lg={3}>
                <Typography variant='body2'> Name....</Typography>
              </Grid>
              <Grid item xs={8} sm={6} md={5} lg={3}>
                <Typography variant='body2' sx={{ minWidth: 120 }}>
                  Curriculum (EN) :
                </Typography>
              </Grid>
              <Grid item xs={4} sm={6} md={2.5} lg={3}>
                <Typography variant='body2'> Name....</Typography>
              </Grid>
              <Grid item xs={8} sm={6} md={5} lg={3}>
                <Typography variant='body2' sx={{ minWidth: 120 }}>
                  Faculty :
                </Typography>
              </Grid>
              <Grid item xs={4} sm={6} md={2.5} lg={3}>
                <Typography variant='body2'> Name....</Typography>
              </Grid>
              <Grid item xs={6} sm={12} md={12} lg={6}>
                <Typography variant='body2' sx={{ minWidth: 120 }}></Typography>
              </Grid>
              <Grid item xs={8} sm={6} md={5} lg={3}>
                <Typography variant='body2' sx={{ minWidth: 120 }}>
                  Student Group :
                </Typography>
              </Grid>
              <Grid item xs={4} sm={6} md={2.5} lg={3}>
                <Typography variant='body2'> Name....</Typography>
              </Grid>
              <Grid item xs={8} sm={6} md={5} lg={3}>
                <Typography variant='body2' sx={{ minWidth: 120 }}>
                  Year :
                </Typography>
              </Grid>
              <Grid item xs={4} sm={6} md={2.5} lg={3}>
                <Typography variant='body2'> ......</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item sx={{ ml: 10, mr: 10, display: 'flex', justifyContent: 'space-between' }}>
        <Grid item xs={12} sm={12} lg={12}>
          <DataGridTable rows={rows_details} columns={columns_details} />
        </Grid>
      </Grid>
      <DialogActions sx={{ mt: 20 }}>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}

export default CurriculumDetailsModal
