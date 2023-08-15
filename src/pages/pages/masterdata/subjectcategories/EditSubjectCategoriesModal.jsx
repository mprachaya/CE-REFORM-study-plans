import React, { useEffect, useState } from 'react'
import { Dialog, Typography, DialogContent, Grid, TextField, DialogActions, Button, Box } from '@mui/material'

import Icon from '@mdi/react'
import { mdiDelete } from '@mdi/js'
import { handleChangeEN, handleChangeTH } from 'src/hooks/useValidation'

function EditSubjectCategoriesModal({ state, open, handleClose, handleUpdate, openConfirmDelete }) {
  const initialsState = {
    subject_category_name: ''
  }

  const [updateState, setUpdateState] = useState([])

  const checkIsEmpty = object => {
    var isEmpty = false

    Object.keys(object).forEach(function (key) {
      var val = object[key]
      if (val === '') {
        isEmpty = true
      }
    })

    if (isEmpty) {
      alert('Please Fill All TextFields')
    }

    return isEmpty
  }

  // new Object to get some properties
  useEffect(() => {
    if (open && state) {
      const { subject_category_name } = state

      const newObj = {
        subject_category_name: subject_category_name
      }

      console.log('newObj :', newObj)
      setUpdateState(newObj)
    }
  }, [open, state])

  useEffect(() => {
    console.log(updateState)
  }, [updateState])

  return (
    <Dialog open={open} onClose={() => handleClose(setUpdateState(initialsState))} maxWidth={'lg'} fullWidth>
      <DialogContent sx={{ minHeight: 450 }}>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Typography variant='h6' sx={{ mt: 5, ml: 5 }}>
            Add new Subject Category
          </Typography>
          <Button
            color='error'
            variant='outlined'
            onClick={() => openConfirmDelete()}
            startIcon={<Icon bgcolor='red' path={mdiDelete} size={0.75} />}
          >
            Delete
          </Button>
        </Box>
        <DialogContent sx={{ display: 'flex' }}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={12} md={12} lg={6}>
              <TextField
                fullWidth
                name={'subject_category_name'}
                label='Subject Category Name TH*'
                placeholder='Thai Only'
                onChange={e => handleChangeTH(e, setUpdateState)}
                value={updateState.subject_category_name}
              />
            </Grid>
          </Grid>
        </DialogContent>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(setUpdateState(initialsState))} color='secondary'>
          Cancel
        </Button>
        <Button onClick={() => !checkIsEmpty(updateState) && handleUpdate(updateState)}>Update</Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditSubjectCategoriesModal
