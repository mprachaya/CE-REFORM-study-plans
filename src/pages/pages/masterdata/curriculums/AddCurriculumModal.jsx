import {
  Dialog,
  Typography,
  DialogContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
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
import Selection from 'src/components/Selection'
import useValidation from 'src/hooks/useValidation'

function AddCurriculumModal({ open, handleClose, handleSubmit, faculty, studentGroups }) {
  const [facultySelection, setFacultySelection] = useState(0)
  const [studentGroupsSelection, setStudentGroupsSelection] = useState(0)

  const initialsState = {
    faculty_id: 0,
    collegian_group_id: 0,
    curriculum_name_th: '',
    curriculum_name_en: '',
    curriculum_short_name_th: '',
    curriculum_short_name_en: '',
    curriculum_year: '',
    ref_curriculum_id: ''
  }

  const [state, setState] = useState({
    faculty_id: 0,
    collegian_group_id: 0,
    curriculum_name_th: '',
    curriculum_name_en: '',
    curriculum_short_name_th: '',
    curriculum_short_name_en: '',
    curriculum_year: 0,
    ref_curriculum_id: ''
  })

  const { validEng, validThai } = useValidation()

  // handleChange for th
  const handleChangeTH = e => {
    if (validThai.test(e.target.value) || e.target.value === '')
      setState(pre => ({ ...pre, [e.target.name]: e.target.value }))
  }

  // handleChange for en
  const handleChangeEN = e => {
    if (validEng.test(e.target.value) || e.target.value === '')
      setState(pre => ({ ...pre, [e.target.name]: e.target.value }))
  }

  // handleChange for number
  const handleChangeNumber = e => {
    setState(pre => ({ ...pre, [e.target.name]: e.target.value }))
  }

  useEffect(() => {
    setState(pre => ({ ...pre, faculty_id: facultySelection }))
  }, [facultySelection])

  useEffect(() => {
    setState(pre => ({ ...pre, collegian_group_id: studentGroupsSelection }))
  }, [studentGroupsSelection])

  // reset state when open/close
  useEffect(() => {
    setState(initialsState)
    setStudentGroupsSelection(0)
    setFacultySelection(0)
  }, [open])

  useEffect(() => {
    console.log(state)
  }, [state])

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={'lg'} fullWidth>
      <DialogContent sx={{ minHeight: 450 }}>
        <Typography variant='h6' sx={{ mt: 5, ml: 5 }}>
          Add new curriculum
        </Typography>
        <DialogContent sx={{ display: 'flex' }}>
          <Grid container spacing={6}>
            <Grid item sm={12} md={12} lg={6}>
              <TextField
                fullWidth
                name={'curriculum_name_th'}
                label='Curriculum Name TH *'
                placeholder='Thai Only'
                onChange={handleChangeTH}
                value={state.curriculum_name_th}
              />
            </Grid>
            <Grid item sm={12} md={12} lg={6}>
              <TextField
                fullWidth
                name={'curriculum_name_en'}
                label='Curriculum Name EN *'
                placeholder='English Only'
                onChange={handleChangeEN}
                value={state.curriculum_name_en}
              />
            </Grid>
            <Grid item sm={12} md={12} lg={6}>
              <TextField
                fullWidth
                name={'curriculum_short_name_th'}
                label='Curriculum Short Name TH *'
                placeholder='Thai Only'
                onChange={handleChangeTH}
                value={state.curriculum_short_name_th}
              />
            </Grid>
            <Grid item sm={12} md={12} lg={6}>
              <TextField
                fullWidth
                name={'curriculum_short_name_en'}
                label='Curriculum Short Name EN *'
                placeholder='English Only'
                onChange={handleChangeEN}
                value={state.curriculum_short_name_en}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogContent sx={{ display: 'flex' }}>
          <Grid container spacing={6}>
            <Grid item sm={12} md={12} lg={6}>
              <Selection
                label={'Faculty'}
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
            <Grid item sm={12} md={12} lg={6}>
              <Selection
                label={'Student Groups'}
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

            <Grid item sm={12} md={12} lg={6}>
              <TextField
                type='number'
                name={'curriculum_year'}
                value={state.curriculum_year}
                onChange={handleChangeNumber}
                fullWidth
                label='Year *'
                placeholder='Number Only '
              />
            </Grid>

            <Grid item sm={12} md={12} lg={3}>
              <FormGroup>
                <FormControlLabel control={<Checkbox defaultChecked />} label='Duplicate Subjects' />
              </FormGroup>
            </Grid>

            <Grid item sm={12} md={12} lg={3}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>From Curriculum *</InputLabel>
                <Select
                  disabled
                  label='Category'
                  defaultValue=''
                  id='form-layouts-separator-select'
                  labelId='form-layouts-separator-select-label'
                >
                  <MenuItem value='University 1'>* </MenuItem>
                  <MenuItem value='University 2'>** </MenuItem>
                  <MenuItem value='University 3'>*** </MenuItem>
                  <MenuItem value='University 4'>**** </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='secondary'>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddCurriculumModal
