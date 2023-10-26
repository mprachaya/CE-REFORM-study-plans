import React, { useEffect, useState } from 'react'
import { Dialog, Typography, DialogContent, Grid, TextField, DialogActions, Button, Box } from '@mui/material'

import Icon from '@mdi/react'
import { mdiDelete } from '@mdi/js'
import { handleChangeEN, handleChangeTH } from 'src/hooks/useValidation'

function EditStudentGroupModal({ state, open, handleClose, handleUpdate, openConfirmDelete }) {
  const initialsState = {
    collegian_group_name_th: '',
    collegian_group_name_en: '',
    collegian_group_short_name_th: '',
    collegian_group_short_name_en: ''
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
    if (open) {
      const {
        collegian_group_name_th,
        collegian_group_name_en,
        collegian_group_short_name_th,
        collegian_group_short_name_en
      } = state

      const newObj = {
        collegian_group_name_th: collegian_group_name_th,
        collegian_group_name_en: collegian_group_name_en,
        collegian_group_short_name_th: collegian_group_short_name_th,
        collegian_group_short_name_en: collegian_group_short_name_en
      }

      console.log('newObj :', newObj)
      setUpdateState(newObj)
    }
  }, [open])

  useEffect(() => {
    console.log(updateState)
  }, [updateState])

  return (
    <Dialog open={open} onClose={() => handleClose(setUpdateState(initialsState))} maxWidth={'lg'} fullWidth>
      <DialogContent sx={{ minHeight: 450 }}>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Typography variant='h6' sx={{ mt: 5, ml: 5 }}>
            Update Faculty
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
                name={'collegian_group_name_th'}
                label='Group Name TH*'
                placeholder='Thai Only'
                onChange={e => handleChangeTH(e, setUpdateState)}
                value={updateState.collegian_group_name_th || ''}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={6}>
              <TextField
                fullWidth
                name={'collegian_group_name_en'}
                label='Group Name EN*'
                placeholder='English Only'
                onChange={e => handleChangeEN(e, setUpdateState)}
                value={updateState.collegian_group_name_en || ''}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={6}>
              <TextField
                fullWidth
                name={'collegian_group_short_name_th'}
                label='Group Short Name TH*'
                placeholder='Thai Only'
                onChange={e => handleChangeTH(e, setUpdateState)}
                value={updateState.collegian_group_short_name_th || ''}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={6}>
              <TextField
                fullWidth
                name={'collegian_group_short_name_en'}
                label='Group Short Name EN*'
                placeholder='English Only'
                onChange={e => handleChangeEN(e, setUpdateState)}
                value={updateState.collegian_group_short_name_en || ''}
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

export default EditStudentGroupModal
