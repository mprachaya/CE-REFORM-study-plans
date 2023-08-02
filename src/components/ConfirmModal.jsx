import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Divider, Grid } from '@mui/material'
import Icon from '@mdi/react'

function ConfirmModal({ title, displayIcon, text, open, handleClose, submitLabel, handleSubmit }) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        <Grid container spacing={6}>
          <Grid item>
            <Icon path={displayIcon} size={2} color='red' />
          </Grid>
          <Grid item>
            <Typography fontWeight={'bold'} letterSpacing={-0.25}>
              {title}
            </Typography>
            <Typography variant='body2'>{text}</Typography>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <Divider />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          <Typography color={'lightgray'} fontWeight={'bold'}>
            CLOSE
          </Typography>
        </Button>
        <Button variant='contained' color={'error'} onClick={handleSubmit}>
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmModal
