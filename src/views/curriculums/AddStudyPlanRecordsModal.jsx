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
  Autocomplete,
  Box
} from '@mui/material'
import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { CircleLoading, DataGridTable } from 'src/components'
import Selection from 'src/components/Selection'
import { url } from 'src/configs/urlConfig'
import { useFetch } from 'src/hooks'
import { handleChangeEN, handleChangeNumber, handleChangeTH } from 'src/hooks/useValidation'

function AddStudyPlanRecordsModal({
  open,
  handleClose,
  studyPlan,
  allRecord,
  setAllRecord,
  year,
  semester,
  Plans,
  setPlans,
  handleSubmit
}) {
  // const [curriculumSelection, setCurriculumSelection] = useState(0)
  // const [facultySelection, setFacultySelection] = useState(0)
  // const [studentGroupsSelection, setStudentGroupsSelection] = useState(0)
  // const [duplicateState, setDuplicateState] = useState(false)

  // const URL_GET_CURRICULUMS = `${url.BASE_URL}/curriculums/`
  // const [curriculumSelected, setCurriculumSelected] = useState(0)

  // const {
  //   error: CurriculumsError,
  //   data: Curriculums,
  //   setData: setCurriculums,
  //   loading: CurriculumsLoading,
  //   reFetch: reFetchCurriculums
  // } = useFetch(URL_GET_CURRICULUMS)

  // const URL_GET_STUDY_PLANS = `${url.BASE_URL}/study-plans/`
  // const URL_GET_SUB_STUDY_PLANS = `${url.BASE_URL}/study-plan-records/`

  // const {
  //   error: StudyPlanssError,
  //   data: StudyPlans,
  //   setData: setStudyPlans,
  //   loading: StudyPlansLoading,
  //   reFetch: reFetchStudyPlans
  // } = useFetch(URL_GET_STUDY_PLANS + curriculumId)

  const URL_GET_SUBJECTS_BY_CURRICULUM = `${url.BASE_URL}/subjects-by-curriculum/`
  const URL_GET_STUDY_PLAN_RECORDS = `${url.BASE_URL}/study-plan-records/`
  const URL_GET_STUDY_PLANS = `${url.BASE_URL}/study-plans/`

  const {
    error: SubjectsError,
    data: Subjects,
    setData: setSubjects,
    loading: SubjectsLoading,
    reFetch: reFetchSubjects
  } = useFetch(URL_GET_SUBJECTS_BY_CURRICULUM + studyPlan?.curriculum_id)

  const [subjectsFilterByRecord, setSubjectFilterByRecord] = useState([])

  const filterSubjects = allRecord => {
    const getSubjectIdfromRecord = allRecord.map(rc => rc.subject_id).filter(sjId => sjId !== null)
    // console.log('getSubjectIdfromRecord', getSubjectIdfromRecord)

    const SubjectNotInRecord = Subjects.filter(
      sj => sj.subject_id !== getSubjectIdfromRecord.find(rId => rId === sj.subject_id)
    )
    setSubjectFilterByRecord(SubjectNotInRecord)
  }

  useEffect(() => {
    if (Subjects.length !== 0) {
      filterSubjects(allRecord)
    }
  }, [Subjects])

  const createBy = [
    { id: 0, label: 'เลือกจากวิชาในหลักสูตร' },
    { id: 1, label: 'กำหนดเอง' }
  ]
  const [yearSelected, setYearSelected] = useState(year)
  const years = [1, 2, 3, 4]

  const [semesterSelected, setSemesterSelected] = useState(semester)
  const semesters = [1, 2]

  const [createByValue, setCreateByValue] = useState(0)
  const [clearAutoComplete, setClearAutoComplete] = useState(false)
  // const [planSelected, setPlanSeleted] = useState(0)
  // const [planName, setPlanName] = useState('')

  // // console.log(StudyPlans)
  const initialsState = {
    study_plan_id: studyPlan?.study_plan_id,
    subject_id: null,
    study_plan_record_elective_course: null,
    study_plan_record_semester: 1,
    study_plan_record_year: 1
  }
  const [state, setState] = useState(initialsState)

  const columnsForEdit = [
    {
      field: 'subject_name',
      headerName: 'Subject',
      width: 600,
      valueGetter: params => {
        if (!params.row.subjects) {
          return params.row?.study_plan_record_elective_course
        } else {
          return (
            params.row.subjects?.subject_code +
            ' ' +
            params.row.subjects?.subject_name_th +
            ' (' +
            params.row.subjects?.subject_name_en +
            ')'
          )
        }
      }
    },
    {
      field: 'credit',
      headerName: 'Credit',
      width: 120,
      valueGetter: params => {
        if (params.row?.subjects == null) {
          return 3
        } else {
          return params.row?.subjects.subject_credit
        }
      }
    },
    {
      field: 'study_plan_record_year',
      headerName: 'Year',
      width: 120
    },
    {
      field: 'study_plan_record_semester',
      headerName: 'Semester',
      width: 120
    },
    {
      field: 'fn',
      headerName: '',
      width: 120,
      renderCell: params => (
        <Grid container spacing={2} justifyContent={'center'}>
          <Grid item>
            <Button
              color='secondary'
              variant='outlined'
              onClick={() => {
                handleDeletePlanRecord(params.row)
              }}
            >
              Remove
            </Button>
          </Grid>
        </Grid>
      )
    }
  ]

  // const [duplicateSubPlans, setDuplicateSubPlan] = useState([])

  // const [isDone, setIsDone] = useState(null)

  // const handleRefPlanChange = plan => {
  //   const checkDuplicate = StudyPlans.filter(p => p.study_plan_name === plan.study_plan_name)

  //   console.log('checkDuplicate ', checkDuplicate)

  //   const lastedVersion = checkDuplicate.reduce((max, current) => {
  //     const currentValue = current['study_plan_version']
  //     return currentValue > max['study_plan_version'] ? current : max
  //   })
  //   console.log('lasted version ', lastedVersion)

  //   if (plan) {
  //     setState(pre => ({
  //       ...pre,
  //       study_plan_name: plan.study_plan_name,
  //       study_plan_version: lastedVersion.study_plan_version + 1,
  //       study_plan_total_credit: plan.study_plan_total_credit
  //     }))
  //     axios
  //       .get(URL_GET_SUB_STUDY_PLANS + plan.study_plan_id)
  //       .then(res => {
  //         setDuplicateSubPlan(res.data.data)
  //         console.log(res.data.data)
  //       })
  //       .catch(err => console.log(err))
  //   }
  // }

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
  //   if (studyPlan) {
  //     setState(initialsState)
  //   }
  // }, [studyPlan])

  const postNewRecord = () => {
    axios
      .post(URL_GET_STUDY_PLAN_RECORDS, state)
      .then(res => {
        if (res.data.status === 201) {
          console.log(res.data.message)
          const updateRecords = allRecord.concat(res.data.data)
          console.log('updateRecords ', updateRecords)
          setAllRecord(updateRecords) // update all record
          filterSubjects(updateRecords) // update subjects for autocomplete
          setClearAutoComplete(!clearAutoComplete) // clear autocomplete
          let updateCredit = 0
          updateRecords.forEach(obj => {
            if (obj.subjects !== null) {
              updateCredit += obj.subjects?.subject_credit
            } else {
              updateCredit += 3
            }
          })
          const planTemp = Plans
          const planRow = Plans[0]
          planRow.study_plan_total_credit = updateCredit
          const updateState = {
            curriculum_id: planRow.curriculum_id,
            study_plan_name: planRow.study_plan_name,
            study_plan_total_credit: planRow.study_plan_total_credit
          }

          // console.log('updatelocal credit: ', updateState)
          axios.put(URL_GET_STUDY_PLANS + studyPlan.study_plan_id, updateState).then(res => {
            if (res.data.status === 200) {
              // console.log(res.data.message)
              planRow.updated_at = res.data.data.updated_at
              planTemp[0] = planRow
              setPlans(planTemp)
              // console.log('planTemp', planTemp)
            }
          })
          // console.log('updateTotalCredit = ', updateCredit)
        }
      })
      .catch(err => console.log(err))
  }

  const handleAddNewRecord = () => {
    if (createByValue === 0) {
      if (state.subject_id === null) return alert('Please select subject')
      console.log('insert with subject ', state)
      postNewRecord()
      // case insert by subject
    } else {
      if (state.study_plan_record_elective_course === null) return alert('Please Fill Subject Name ')
      // case insert new text without reference by subject
      console.log('insert without subject ', state)
      postNewRecord()
    }
  }

  const handleDeletePlanRecord = record => {
    if (allRecord.length > 0) {
      axios
        .delete(URL_GET_STUDY_PLAN_RECORDS + record.study_plan_record_id)
        .then(res => {
          if (res.data.status === 200) {
            console.log(res.data.message)
            const updateRecords = Object.values(allRecord)?.filter(
              r => r.study_plan_record_id !== record.study_plan_record_id
            )
            setAllRecord(updateRecords)
            filterSubjects(updateRecords)
            setClearAutoComplete(!clearAutoComplete)
            let updateCredit = 0
            updateRecords.forEach(obj => {
              if (obj.subjects !== null) {
                updateCredit += obj.subjects?.subject_credit
              } else {
                updateCredit += 3
              }
            })
            const planTemp = Plans
            const planRow = Plans[0]
            planRow.study_plan_total_credit = updateCredit
            const updateState = {
              curriculum_id: planRow.curriculum_id,
              study_plan_name: planRow.study_plan_name,
              study_plan_total_credit: planRow.study_plan_total_credit
            }

            console.log('updatelocal credit: ', updateState)
            axios.put(URL_GET_STUDY_PLANS + studyPlan.study_plan_id, updateState).then(res => {
              if (res.data.status === 200) {
                console.log(res.data.message)
                planRow.updated_at = res.data.data.updated_at
                planTemp[0] = planRow
                setPlans(planTemp)
                console.log('planTemp', planTemp)
              }
            })
            // console.log('updateTotalCredit = ', updateCredit)
          }
        })
        .catch(err => console.log(err))
    }
  }

  useEffect(() => {
    setYearSelected(year)
    setSemesterSelected(semester)
    setState(initialsState)
  }, [open])

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
      <DialogContent sx={{ minHeight: 700 }}>
        <Typography variant='h6' sx={{ mt: 5, ml: 5 }}>
          Add new study plan record in ({studyPlan?.study_plan_name}) {'Lasted Update '}
          {
            new Date(studyPlan?.updated_at)
              .toLocaleDateString('en-TH', {
                weekday: 'long',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })
              .split(' BE')[0]
          }
        </Typography>

        {/* {!isDone && isDone !== null ? ( */}
        {/* <Grid
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
        </Grid> */}
        {/* ) : ( */}
        <React.Fragment>
          <DialogContent>
            <Grid container spacing={6}>
              <Grid item xs={6} md={4}>
                <Selection
                  width={'100%'}
                  label={'Create Type'}
                  selectionValue={createByValue}
                  handleChange={
                    e => {
                      setCreateByValue(e.target.value)
                      if (e.target.value === 0) {
                        const refSubjectState = {
                          study_plan_id: studyPlan?.study_plan_id,
                          subject_id: 0,
                          study_plan_record_elective_course: null,
                          study_plan_record_semester: 1,
                          study_plan_record_year: 1
                        }
                        setState(refSubjectState)
                      } else if (e.target.value === 1) {
                        const noRefState = {
                          study_plan_id: studyPlan?.study_plan_id,
                          subject_id: null,
                          study_plan_record_elective_course: '',
                          study_plan_record_semester: 1,
                          study_plan_record_year: 1
                        }
                        setState(noRefState)
                      }
                    }
                    // setState(initialsState)
                  }
                  Items={Object.values(createBy)?.map(cb => (
                    <MenuItem key={cb.id} value={cb.id}>
                      {cb.label}
                    </MenuItem>
                  ))}
                />
              </Grid>
              <Grid item xs={6} md={4}>
                <Selection
                  width={'100%'}
                  label={'Year'}
                  selectionValue={state.study_plan_record_year || ''}
                  // firstItemText={'Choose Year'}
                  handleChange={e => {
                    setYearSelected(e.target.value)
                    setState(pre => ({ ...pre, study_plan_record_year: e.target.value }))
                  }}
                  Items={Object.values(years)?.map(year => (
                    <MenuItem key={year} value={year}>
                      ปีการศึกษา {year}
                    </MenuItem>
                  ))}
                />
              </Grid>
              <Grid item xs={6} md={4}>
                <Selection
                  width={'100%'}
                  label={'Semester'}
                  selectionValue={state.study_plan_record_semester}
                  // firstItemText={'Choose Semester'}
                  handleChange={e => {
                    setSemesterSelected(e.target.value)
                    setState(pre => ({ ...pre, study_plan_record_semester: e.target.value }))
                  }}
                  Items={semesters.map(s =>
                    s !== 3 ? (
                      <MenuItem key={s} value={s}>
                        {'เทอม ' + s}
                      </MenuItem>
                    ) : (
                      <MenuItem key={s} value={s}>
                        {'เทอม 1 และเทอม 2'}
                      </MenuItem>
                    )
                  )}
                />
              </Grid>
              {/* type inner subject */}
              {createByValue === 0 && (
                <React.Fragment>
                  <Grid item xs={6}>
                    {/* <Autocomplete /> */}
                    <Autocomplete
                      key={clearAutoComplete} // if toggle will clear value of autocomplete
                      disablePortal
                      fullWidth
                      options={subjectsFilterByRecord}
                      getOptionLabel={option => option.subject_code + ' ' + option.subject_name_th}
                      renderInput={params => <TextField {...params} label='Code, Subject name ' />}
                      onChange={(e, value) => {
                        if (value?.subject_id !== undefined) {
                          setState(pre => ({
                            ...pre,
                            study_plan_record_elective_course: null,
                            subject_id: value?.subject_id
                          }))
                        } else {
                          setState(pre => ({
                            ...pre,
                            study_plan_record_elective_course: null,
                            subject_id: null
                          }))
                        }
                        // setSubjectSelected(e.target.value)
                      }}

                      // onChange={e => handleChangeEN(e, setState)}
                      // value={state.curriculum_name_en}
                    />
                    {/* <Selection
                      width={'100%'}
                      firstItemText={'Choose Subject'}
                      selectionValue={subjectSelected}
                      // handleChange={e => {
                      //   setCreateByValue(e.target.value)
                      //   console.log(e.target.value)
                      //   // setPlanSeleted(0)
                      //   setState(initialsState)
                      // }}
                      Items={Object.values(Subjects)?.map(sj => (
                        <MenuItem key={sj.subject_id} value={sj.subject_id}>
                          {sj.subject_code + ' '}
                          {sj.subject_name_th}
                        </MenuItem>
                      ))}
                    /> */}
                  </Grid>
                </React.Fragment>
              )}
              {/* type elective subject */}
              {createByValue === 1 && (
                <React.Fragment>
                  <Grid item xs={6}>
                    <TextField
                      value={state.study_plan_record_elective_course}
                      onChange={e => {
                        const trimString = e.target.value.trimStart()
                        setState(pre => ({ ...pre, study_plan_record_elective_course: trimString }))
                      }}
                      fullWidth
                      label={'Elective Subject Name'}
                    />
                    {/* <Selection
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
                    /> */}
                  </Grid>
                </React.Fragment>
              )}
              <Grid item xs={12} md={6}>
                <Button
                  sx={{ height: 55 }}
                  variant='contained'
                  fullWidth
                  onClick={() => {
                    handleAddNewRecord()
                  }}
                >
                  Add new record
                </Button>
              </Grid>
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
            <Grid sx={{ mt: 2 }}>
              {/* <Box fullWidth sx={{ bgcolor: 'gray', height: 400 }}>
                table show records
              </Box>
               */}
              <DataGridTable
                rows={allRecord?.filter(
                  planFilter =>
                    planFilter.study_plan_record_year === yearSelected &&
                    planFilter.study_plan_record_semester === semesterSelected
                )}
                columns={columnsForEdit}
                uniqueKey={'study_plan_record_id'}
                // isLoading={PlanRecordLoading === null ? true : PlanRecordLoading}
                noData='ยังไม่มีรายการแผนการเรียน'
              />
            </Grid>
          </DialogContent>
        </React.Fragment>
        {/* )} */}
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
        {/* <Button onClick={() => handleSubmit(state, createByValue, setIsDone, duplicateSubPlans)}>Create</Button> */}
      </DialogActions>
    </Dialog>
  )
}

export default AddStudyPlanRecordsModal
