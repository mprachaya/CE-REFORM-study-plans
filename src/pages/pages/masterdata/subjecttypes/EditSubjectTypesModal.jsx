import React, { useEffect, useState } from 'react'
import { Dialog, Typography, DialogContent, Grid, TextField, DialogActions, Button, Box, MenuItem } from '@mui/material'

import Icon from '@mdi/react'
import { mdiDelete } from '@mdi/js'
import { handleChangeEN, handleChangeTH } from 'src/hooks/useValidation'
import { Selection } from 'src/components'

function EditSubjectTypesModal({ state, open, handleClose, handleUpdate, openConfirmDelete, Categories }) {
  const initialsState = {
    subject_category_id: '',
    subject_type_name: ''
  }
  const [updateState, setUpdateState] = useState([])

  const [categorySelection, setCategorySelection] = useState(0)

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
      const { subject_type_name, subject_category_id } = state

      setCategorySelection(subject_category_id)

      const newObj = {
        subject_category_id: subject_category_id,
        subject_type_name: subject_type_name
      }

      console.log('newObj :', newObj)
      setUpdateState(newObj)
    }
  }, [open, state])

  useEffect(() => {
    console.log(updateState)
  }, [updateState])

  return (
    <Dialog open={open} onClose={() => handleClose(setState(initialsState))} maxWidth={'lg'} fullWidth>
      <DialogContent sx={{ minHeight: 450 }}>
        <Typography variant='h6' sx={{ mt: 5, ml: 5 }}>
          Add new Subject Category
        </Typography>
        <DialogContent sx={{ display: 'flex' }}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={12} md={12} lg={6}>
              <Selection
                width={'100%'}
                firstItemText={'Choose Category*'}
                selectionValue={categorySelection}
                handleChange={e => {
                  setCategorySelection(e.target.value)
                  setUpdateState(pre => ({ ...pre, subject_category_id: e.target.value }))
                }}
                Items={Object.values(Categories)?.map(category => (
                  <MenuItem key={category.subject_category_id} value={category.subject_category_id}>
                    {category.subject_category_name}
                  </MenuItem>
                ))}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={6}>
              <TextField
                fullWidth
                name={'subject_type_name'}
                label='Subject Type Name*'
                placeholder='Thai Only'
                onChange={e => handleChangeTH(e, setUpdateState)}
                value={updateState.subject_type_name}
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

export default EditSubjectTypesModal
