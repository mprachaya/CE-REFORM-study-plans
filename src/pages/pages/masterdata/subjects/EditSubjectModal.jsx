import React, { useEffect, useState } from 'react'
import { Dialog, Typography, DialogContent, Grid, TextField, DialogActions, Button, MenuItem, Box } from '@mui/material'

import Icon from '@mdi/react'
import { mdiSitemapOutline, mdiPen, mdiDelete } from '@mdi/js'
import Selection from 'src/components/Selection'
import { handleChangeEN, handleChangeNumber, handleChangeTH } from 'src/hooks/useValidation'

function EditSubjectModal({ state, open, handleClose, curriculumId, subjectGroups, handleUpdate, openConfirmDelete }) {
  const [subjectGroupSelection, setSubjectGroupSelection] = useState(0)

  const initialsState = {
    curriculum_id: curriculumId,
    subject_group_id: 0,
    subject_code: '',
    subject_name_th: '',
    subject_name_en: '',
    subject_credit: '',
    subject_description: ''
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
      const {
        curriculum_id,
        subject_group_id,
        subject_code,
        subject_name_th,
        subject_name_en,
        subject_credit,
        subject_description
      } = state

      const newObj = {
        curriculum_id: curriculum_id,
        subject_group_id: subject_group_id,
        subject_code: subject_code,
        subject_name_th: subject_name_th,
        subject_name_en: subject_name_en,
        subject_credit: subject_credit,
        subject_description: subject_description
      }

      setSubjectGroupSelection(subject_group_id)

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
            Update subject
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
                onChange={e => setUpdateState(pre => ({ ...pre, subject_code: e.target.value }))}
                value={updateState.subject_code}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={6}>
              <TextField
                fullWidth
                name={'subject_name_th'}
                label='Subject Name TH*'
                placeholder='Thai Only'
                onChange={e => handleChangeTH(e, setUpdateState)}
                value={updateState.subject_name_th}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={8} lg={4}>
              <TextField
                fullWidth
                name={'subject_name_en'}
                label='Subject Name EN*'
                placeholder='English Only'
                onChange={e => handleChangeEN(e, setUpdateState)}
                value={updateState.subject_name_en}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={2}>
              <TextField
                fullWidth
                name={'subject_credit'}
                label='Subject Credit*'
                placeholder='Number Only'
                onChange={e => handleChangeNumber(e, setUpdateState)}
                value={updateState.subject_credit}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogContent sx={{ display: 'flex' }}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={12} md={12} lg={12} height={200}>
              <TextField
                fullWidth
                name={'subject_description'}
                label='Description*'
                rows={4}
                multiline
                onChange={e => setUpdateState(pre => ({ ...pre, subject_description: e.target.value }))}
                value={updateState.subject_description}
              />
            </Grid>
          </Grid>
        </DialogContent>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='secondary'>
          Cancel
        </Button>
        <Button onClick={() => !checkIsEmpty(updateState) && handleUpdate(updateState)}>Update</Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditSubjectModal
