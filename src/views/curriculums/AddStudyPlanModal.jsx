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
  Button,
  Autocomplete
} from '@mui/material'
import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { CircleLoading } from 'src/components'
import Selection from 'src/components/Selection'
import { url } from 'src/configs/urlConfig'
import { useFetch } from 'src/hooks'
import { handleChangeEN, handleChangeNumber, handleChangeTH } from 'src/hooks/useValidation'

function AddStudyPlanModal({ open, handleClose, curriculumId, handleSubmit }) {
  // const [curriculumSelection, setCurriculumSelection] = useState(0)
  // const [facultySelection, setFacultySelection] = useState(0)
  // const [studentGroupsSelection, setStudentGroupsSelection] = useState(0)
  // const [duplicateState, setDuplicateState] = useState(false)

  const URL_GET_CURRICULUMS = `${url.BASE_URL}/curriculums/`
  const [curriculumSelected, setCurriculumSelected] = useState(0)

  const {
    error: CurriculumsError,
    data: Curriculums,
    setData: setCurriculums,
    loading: CurriculumsLoading,
    reFetch: reFetchCurriculums
  } = useFetch(URL_GET_CURRICULUMS)

  const URL_GET_STUDY_PLANS = `${url.BASE_URL}/study-plans/`
  const URL_GET_SUB_STUDY_PLANS = `${url.BASE_URL}/study-plan-records/`

  const {
    error: StudyPlanssError,
    data: StudyPlans,
    setData: setStudyPlans,
    loading: StudyPlansLoading,
    reFetch: reFetchStudyPlans
  } = useFetch(URL_GET_STUDY_PLANS + curriculumId)

  const createBy = [
    { id: 0, label: 'No Refference' },
    { id: 1, label: 'With Reference' }
  ]
  const [createByValue, setCreateByValue] = useState(0)
  const [planSelected, setPlanSeleted] = useState(0)
  const [planName, setPlanName] = useState('')

  // console.log(StudyPlans)
  const initialsState = {
    curriculum_id: curriculumId,
    study_plan_name: '',
    study_plan_version: 1,
    study_plan_total_credit: 0
  }
  const [state, setState] = useState(initialsState)

  const [duplicateSubPlans, setDuplicateSubPlan] = useState([])

  const [isDone, setIsDone] = useState(null)

  const handleRefPlanChange = plan => {
    const checkDuplicate = StudyPlans.filter(p => p.study_plan_name === plan.study_plan_name)

    console.log('checkDuplicate ', checkDuplicate)

    const lastedVersion = checkDuplicate.reduce((max, current) => {
      const currentValue = current['study_plan_version']
      return currentValue > max['study_plan_version'] ? current : max
    })
    console.log('lasted version ', lastedVersion)

    if (plan) {
      setState(pre => ({
        ...pre,
        study_plan_name: plan.study_plan_name,
        study_plan_version: lastedVersion.study_plan_version + 1,
        study_plan_total_credit: plan.study_plan_total_credit
      }))
      axios
        .get(URL_GET_SUB_STUDY_PLANS + plan.study_plan_id)
        .then(res => {
          setDuplicateSubPlan(res.data.data)
          console.log(res.data.data)
        })
        .catch(err => console.log(err))
    }
  }

  // const checkIsEmpty = object => {
  //   var isEmpty = false

  //   Object.keys(object).forEach(function (key) {
  //     var val = object[key]
  //     if (val === '' || (val === 0 && key !== 'ref_curriculum_id')) {
  //       isEmpty = true
  //     }
  //   })

  //   if (isEmpty) {
  //     alert('Please Fill All TextFields')
  //   }

  //   return isEmpty
  // }

  // useEffect(() => {
  //   setState(pre => ({ ...pre, ref_curriculum_id: curriculumSelection }))
  // }, [curriculumSelection])

  // useEffect(() => {
  //   setState(pre => ({ ...pre, faculty_id: facultySelection }))
  // }, [facultySelection])

  // useEffect(() => {
  //   setState(pre => ({ ...pre, collegian_group_id: studentGroupsSelection }))
  // }, [studentGroupsSelection])

  useEffect(() => {
    console.log(state)
  }, [state])

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={'lg'} fullWidth>
      <DialogContent sx={{ minHeight: 450 }}>
        <Typography variant='h6' sx={{ mt: 5, ml: 5 }}>
          Add new study plan
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
                <Grid item xs={6}>
                  <Selection
                    width={'100%'}
                    selectionValue={createByValue}
                    handleChange={e => {
                      setCreateByValue(e.target.value)
                      console.log(e.target.value)
                      setPlanSeleted(0)
                      setState(initialsState)
                    }}
                    Items={Object.values(createBy)?.map(cb => (
                      <MenuItem key={cb.id} value={cb.id}>
                        {cb.label}
                      </MenuItem>
                    ))}
                  />
                </Grid>
                {createByValue === 0 && (
                  <React.Fragment>
                    <Grid item xs={12} sm={12} md={12} lg={6}>
                      <Selection
                        width={'100%'}
                        disableSelect={true}
                        // firstItemText={'Choose Curriculum *'}
                        selectionValue={curriculumId}
                        // handleChange={e => setState(pre => ({ ...pre, curriculum_id: e.target.value }))}
                        Items={Object.values(Curriculums)?.map(curr => (
                          <MenuItem disabled key={curr.curriculum_id} value={curr.curriculum_id}>
                            {curr.curriculum_name_th}
                          </MenuItem>
                        ))}
                      />
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={6}>
                      <TextField
                        fullWidth
                        name={'study_plan_name'}
                        label='Study Plan Name *'
                        onChange={e => setState(pre => ({ ...pre, study_plan_name: e.target.value }))}
                        value={state?.study_plan_name || ''}
                      />
                    </Grid>
                  </React.Fragment>
                )}
                {createByValue === 1 && (
                  <React.Fragment>
                    <Grid item xs={12} sm={12} md={12} lg={6}>
                      <Selection
                        width={'100%'}
                        firstItemText={'Choose Reference Plan *'}
                        selectionValue={planSelected}
                        handleChange={e => {
                          setPlanSeleted(e.target.value)
                        }}
                        Items={Object.values(StudyPlans)?.map(pl => (
                          <MenuItem
                            key={pl.study_plan_id}
                            value={pl.study_plan_id}
                            onClick={() => {
                              handleRefPlanChange(pl)
                            }}
                          >
                            {pl.study_plan_name + ' Version(' + pl.study_plan_version + ')'}
                          </MenuItem>
                        ))}
                      />
                    </Grid>
                  </React.Fragment>
                )}

                {/* <Grid item xs={12} sm={12} md={12} lg={6}>
                <Autocomplete
                  disablePortal
                  fullWidth
                  options={StudyPlans}
                  inputValue={planName}
                  onInputChange={(e, newInputValue) => {
                    setPlanName(newInputValue)
                  }}
                  getOptionLabel={option => option.study_plan_name}
                  renderInput={params => <TextField {...params} label='Study Plan Name *' />}
                  // onChange={e => setPlanName(e.target.value)}

                  // onChange={e => handleChangeEN(e, setState)}
                  // value={state.curriculum_name_en}
                />
              </Grid> */}
              </Grid>
            </DialogContent>
          </React.Fragment>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setState(initialsState)
            handleClose()
          }}
          color='secondary'
        >
          Cancel
        </Button>
        {/* <Button onClick={() => !checkIsEmpty(state) && handleSubmit(state)}>Submit</Button> */}
        {/* <Button disabled={isDone !== null} onClick={() => !checkIsEmpty(state) && handleSubmit(state, setIsDone)}>
          Submit
        </Button> */}
        <Button onClick={() => handleSubmit(state, createByValue, setIsDone, duplicateSubPlans)}>Create</Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddStudyPlanModal
