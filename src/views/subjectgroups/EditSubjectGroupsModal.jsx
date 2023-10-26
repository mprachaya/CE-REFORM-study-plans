import React, { useEffect, useState } from 'react'
import { Dialog, Typography, DialogContent, Grid, TextField, DialogActions, Button, Box, MenuItem } from '@mui/material'

import Icon from '@mdi/react'
import { mdiDelete } from '@mdi/js'
import { handleChangeEN, handleChangeTH } from 'src/hooks/useValidation'
import { Selection } from 'src/components'

function EditSubjectGroupsModal({ state, open, handleClose, handleUpdate, openConfirmDelete, Categories }) {
  const initialsState = {
    subject_type_id: '',
    subject_group_name: ''
  }
  const [updateState, setUpdateState] = useState([])

  const [typeSelection, setTypeSelection] = useState(0)

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
    if (state) {
      const { subject_group_name, subject_type_id } = state

      setTypeSelection(subject_type_id)

      const newObj = {
        subject_type_id: subject_type_id,
        subject_group_name: subject_group_name
      }

      console.log('newObj :', newObj)
      setUpdateState(newObj)
    }
  }, [state])

  useEffect(() => {
    console.log(updateState)
  }, [updateState])

  return (
    <Dialog open={open} onClose={() => handleClose(setUpdateState(initialsState))} maxWidth={'lg'} fullWidth>
      <DialogContent sx={{ minHeight: 450 }}>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Typography variant='h6' sx={{ mt: 5, ml: 5 }}>
            Update Subject Group
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
              <Selection
                width={'100%'}
                firstItemText={'Choose Type*'}
                selectionValue={typeSelection}
                handleChange={e => {
                  setTypeSelection(e.target.value)
                  setUpdateState(pre => ({ ...pre, subject_type_id: e.target.value }))
                }}
                Items={Object.values(Categories)?.map(category => (
                  <MenuItem key={category.subject_type_id} value={category.subject_type_id}>
                    {category.subject_type_name}
                  </MenuItem>
                ))}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={6}>
              <TextField
                fullWidth
                name={'subject_group_name'}
                label='Subject Group Name*'
                placeholder='Thai Only'
                onChange={e => handleChangeTH(e, setUpdateState)}
                value={updateState.subject_group_name}
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

export default EditSubjectGroupsModal
