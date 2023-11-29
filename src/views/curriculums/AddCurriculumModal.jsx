import {
  Dialog,
  Typography,
  DialogContent,
  Grid,
  TextField,
  MenuItem,
  FormGroup,
  FormControlLabel,
  DialogActions,
  Checkbox,
  Button
} from '@mui/material'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { CircleLoading } from 'src/components'
import Selection from 'src/components/Selection'
import { handleChangeEN, handleChangeNumber, handleChangeTH } from 'src/hooks/useValidation'

function AddCurriculumModal({ open, handleClose, handleSubmit, curriculums, faculty, studentGroups }) {
  const [curriculumSelection, setCurriculumSelection] = useState(0)
  const [facultySelection, setFacultySelection] = useState(0)
  const [studentGroupsSelection, setStudentGroupsSelection] = useState(0)
  const [duplicateState, setDuplicateState] = useState(false)

  const initialsState = {
    faculty_id: 0,
    collegian_group_id: 0,
    curriculum_name_th: '',
    curriculum_name_en: '',
    curriculum_short_name_th: '',
    curriculum_short_name_en: '',
    curriculum_year: '',
    ref_curriculum_id: 0
  }

  const [state, setState] = useState({
    faculty_id: 0,
    collegian_group_id: 0,
    curriculum_name_th: '',
    curriculum_name_en: '',
    curriculum_short_name_th: '',
    curriculum_short_name_en: '',
    curriculum_year: 0,
    ref_curriculum_id: 0
  })

  const [isDone, setIsDone] = useState(null)

  const checkIsEmpty = object => {
    var isEmpty = false

    Object.keys(object).forEach(function (key) {
      var val = object[key]
      if (val === '' || (val === 0 && key !== 'ref_curriculum_id')) {
        isEmpty = true
      }
    })

    if (isEmpty) {
      alert('Please Fill All TextFields')
    }

    return isEmpty
  }

  useEffect(() => {
    setState(pre => ({ ...pre, ref_curriculum_id: curriculumSelection }))
  }, [curriculumSelection])

  useEffect(() => {
    setState(pre => ({ ...pre, faculty_id: facultySelection }))
  }, [facultySelection])

  useEffect(() => {
    setState(pre => ({ ...pre, collegian_group_id: studentGroupsSelection }))
  }, [studentGroupsSelection])

  // reset state when open/close
  useEffect(() => {
    setState(initialsState)
    setCurriculumSelection(0)
    setStudentGroupsSelection(0)
    setFacultySelection(0)
    setDuplicateState(false)
  }, open)

  useEffect(() => {
    console.log(state)
  }, [state])

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={'lg'} fullWidth>
      <DialogContent sx={{ minHeight: 450 }}>
        <Typography variant='h6' sx={{ mt: 5, ml: 5 }}>
          Add new curriculum
        </Typography>
        {!isDone && isDone !== null ? (
          <Grid
            container
            spacing={0}
            direction={'column'}
            alignItems={'center'}
            justifyContent={'center'}
            sx={{ minHeight: '60vh' }}
          >
            <Grid item xs={6}>
              <Typography m={2}> In Processing.....</Typography>
              <CircleLoading />
            </Grid>
          </Grid>
        ) : (
          <React.Fragment>
            <DialogContent sx={{ display: 'flex' }}>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={12} md={12} lg={6}>
                  <TextField
                    fullWidth
                    name={'curriculum_name_th'}
                    label='Curriculum Name TH *'
                    placeholder='Thai Only'
                    onChange={e => handleChangeTH(e, setState)}
                    value={state.curriculum_name_th}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={6}>
                  <TextField
                    fullWidth
                    name={'curriculum_name_en'}
                    label='Curriculum Name EN *'
                    placeholder='English Only'
                    onChange={e => handleChangeEN(e, setState)}
                    value={state.curriculum_name_en}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={6}>
                  <TextField
                    fullWidth
                    name={'curriculum_short_name_th'}
                    label='Curriculum Short Name TH *'
                    placeholder='Thai Only'
                    onChange={e => handleChangeTH(e, setState)}
                    value={state.curriculum_short_name_th}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={6}>
                  <TextField
                    fullWidth
                    name={'curriculum_short_name_en'}
                    label='Curriculum Short Name EN *'
                    placeholder='English Only'
                    onChange={e => handleChangeEN(e, setState)}
                    value={state.curriculum_short_name_en}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogContent sx={{ display: 'flex' }}>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={12} md={12} lg={6}>
                  <Selection
                    width={'100%'}
                    firstItemText={'Choose Faculty *'}
                    selectionValue={facultySelection}
                    handleChange={e => setFacultySelection(e.target.value)}
                    Items={Object.values(faculty)?.map(fac => (
                      <MenuItem key={fac.faculty_id} value={fac.faculty_id}>
                        {fac.faculty_name_th}
                      </MenuItem>
                    ))}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={6}>
                  <Selection
                    width={'100%'}
                    firstItemText={'Choose Student Groups *'}
                    selectionValue={studentGroupsSelection}
                    handleChange={e => setStudentGroupsSelection(e.target.value)}
                    Items={Object.values(studentGroups)?.map(stdg => (
                      <MenuItem key={stdg.collegian_group_id} value={stdg.collegian_group_id}>
                        {stdg.collegian_group_short_name_th}
                      </MenuItem>
                    ))}
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={6}>
                  <TextField
                    type='number'
                    name={'curriculum_year'}
                    value={state.curriculum_year}
                    onChange={e => handleChangeNumber(e, setState)}
                    fullWidth
                    label='Year *'
                    placeholder='Number Only '
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={3}>
                  <FormGroup>
                    <FormControlLabel
                      sx={{ display: 'flex', justifyContent: { sm: 'start', md: 'start', lg: 'end' } }}
                      control={<Checkbox onClick={() => setDuplicateState(!duplicateState)} checked={duplicateState} />}
                      label='Duplicate Subjects'
                    />
                  </FormGroup>
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={3}>
                  <Selection
                    disabled={!duplicateState}
                    width={'100%'}
                    firstItemText={'Choose Curriculum *'}
                    selectionValue={curriculumSelection}
                    handleChange={e => setCurriculumSelection(e.target.value)}
                    Items={Object.values(curriculums)?.map(curri => (
                      <MenuItem key={curri.curriculum_id} value={curri.curriculum_id}>
                        {curri.curriculum_name_th + ' (' + curri.curriculum_year + ')'}
                      </MenuItem>
                    ))}
                  />
                </Grid>
              </Grid>
            </DialogContent>
          </React.Fragment>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='secondary'>
          Cancel
        </Button>
        {/* <Button onClick={() => !checkIsEmpty(state) && handleSubmit(state)}>Submit</Button> */}
        <Button disabled={isDone !== null} onClick={() => !checkIsEmpty(state) && handleSubmit(state, setIsDone)}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddCurriculumModal
