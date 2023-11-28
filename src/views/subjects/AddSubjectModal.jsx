import { Dialog, Typography, DialogContent, Grid, TextField, MenuItem, DialogActions, Button } from '@mui/material'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import Selection from 'src/components/Selection'
import { handleChangeEN, handleChangeNumber, handleChangeTH } from 'src/hooks/useValidation'

function AddSubjectModal({ open, handleClose, handleSubmit, curriculumId, subjectGroups }) {
  const [curriculumSelection, setCurriculumSelection] = useState(0)
  const [subjectGroupSelection, setSubjectGroupSelection] = useState(0)
  const [studentGroupsSelection, setStudentGroupsSelection] = useState(0)
  const [duplicateState, setDuplicateState] = useState(false)

  const initialsState = {
    curriculum_id: curriculumId,
    subject_group_id: null,
    subject_code: '',
    subject_name_th: '',
    subject_name_en: '',
    subject_credit: '',
    subject_description: ''
  }

  const [state, setState] = useState({
    curriculum_id: curriculumId,
    subject_group_id: null,
    subject_code: '',
    subject_name_th: '',
    subject_name_en: '',
    subject_credit: '',
    subject_description: ''
  })

  const checkIsEmpty = object => {
    var isEmpty = false

    Object.keys(object).forEach(function (key) {
      // if (key !== 'subject_group_id') {
      // }

      if (key !== 'subject_group_id') {
        var val = object[key]
        if (val === '' || val === 0) {
          isEmpty = true
        }
      }
    })

    if (isEmpty) {
      alert('Please Fill All TextFields')
    } else {
      console.log('state', object)
    }

    return isEmpty
  }

  useEffect(() => {
    setState(pre => ({ ...pre, curriculum_id: curriculumId }))
  }, [curriculumId])

  useEffect(() => {
    setState(pre => ({ ...pre, subject_group_id: subjectGroupSelection }))
  }, [subjectGroupSelection])

  //reset selection after modal is closed
  useEffect(() => {
    if (state.subject_group_id === 0) setSubjectGroupSelection(0)
  }, [state.subject_group_id])

  useEffect(() => {
    console.log(state)
  }, [state])

  return (
    <Dialog open={open} onClose={() => handleClose(setState(initialsState))} maxWidth={'lg'} fullWidth>
      <DialogContent sx={{ minHeight: 450 }}>
        <Typography variant='h6' sx={{ mt: 5, ml: 5 }}>
          Add new subject
        </Typography>
        <DialogContent sx={{ display: 'flex' }}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={12} md={12} lg={6}>
              <Selection
                width={'100%'}
                firstItemText={'Choose Subject Group*'}
                selectionValue={subjectGroupSelection}
                handleChange={e => setSubjectGroupSelection(e.target.value)}
                Items={Object.values(subjectGroups)?.map(sjg => (
                  <MenuItem key={sjg.subject_group_id} value={sjg.subject_group_id}>
                    {sjg.subject_group_name}
                  </MenuItem>
                ))}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={6}>
              <TextField
                fullWidth
                name={'subject_code'}
                label='Subject Code*'
                placeholder='English Only'
                onChange={e => setState(pre => ({ ...pre, subject_code: e.target.value }))}
                value={state.subject_code}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={6}>
              <TextField
                fullWidth
                name={'subject_name_th'}
                label='Subject Name TH*'
                placeholder='Thai Only'
                onChange={e => handleChangeTH(e, setState)}
                value={state.subject_name_th}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={8} lg={4}>
              <TextField
                fullWidth
                name={'subject_name_en'}
                label='Subject Name EN*'
                placeholder='English Only'
                onChange={e => handleChangeEN(e, setState)}
                value={state.subject_name_en}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={2}>
              <TextField
                fullWidth
                name={'subject_credit'}
                label='Subject Credit*'
                placeholder='Number Only'
                onChange={e => handleChangeNumber(e, setState)}
                value={state.subject_credit}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogContent sx={{ display: 'flex' }}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={12} md={12} lg={12} height={200}>
              <TextField
                sx={{ mt: 2 }}
                fullWidth
                name={'subject_description'}
                label='Description*'
                rows={4}
                multiline
                onChange={e => setState(pre => ({ ...pre, subject_description: e.target.value }))}
                value={state.subject_description}
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

export default AddSubjectModal
