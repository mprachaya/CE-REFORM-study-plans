import { Dialog, Typography, DialogContent, Grid, TextField, DialogActions, Button, MenuItem } from '@mui/material'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Selection } from 'src/components'
import { handleChangeEN, handleChangeTH } from 'src/hooks/useValidation'

function AddSubjectTypesModal({ Categories, open, handleClose, handleSubmit }) {
  const initialsState = {
    subject_category_id: '',
    subject_type_name: ''
  }

  const [state, setState] = useState({
    subject_category_id: '',
    subject_type_name: ''
  })

  const [categorySelection, setCategorySelection] = useState(0)

  const checkIsEmpty = object => {
    var isEmpty = false

    Object.keys(object).forEach(function (key) {
      var val = object[key]
      if (val === '' || val === 0) {
        isEmpty = true
      }
    })

    if (isEmpty) {
      alert('Please Fill All TextFields')
    }

    return isEmpty
  }

  useEffect(() => {
    setState(pre => ({ ...pre, subject_category_id: categorySelection }))
  }, [categorySelection])

  useEffect(() => {
    console.log(state)
  }, [state])

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
                handleChange={e => setCategorySelection(e.target.value)}
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
                onChange={e => handleChangeTH(e, setState)}
                value={state.subject_type_name}
              />
            </Grid>
          </Grid>
        </DialogContent>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(setState(initialsState))} color='secondary'>
          Cancel
        </Button>
        {/* <Button onClick={() => !checkIsEmpty(state) && handleSubmit(state)}>Submit</Button> */}
        <Button onClick={() => !checkIsEmpty(state) && handleSubmit(state, setState(initialsState))}>Submit</Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddSubjectTypesModal
