import React, { useEffect } from 'react'
import { useFetch } from 'src/hooks'
import { useState } from 'react'

import { Btn, CircleLoading, DataGridTable, Selection } from 'src/components'
import { Box, Grid, Typography, MenuItem } from '@mui/material'

import { url } from 'src/configs/urlConfig'
import { useRouter } from 'next/router'
import axios from 'axios'
import AddStudyPlanModal from 'src/views/curriculums/AddStudyPlanModal'
import AddStudyPlanRecordsModal from 'src/views/curriculums/AddStudyPlanRecordsModal'
// import EditSubjectCategoriesModal from '../../../../views/subjecttypes/EditSubjectTypesModal'
// import AddSubjectCategoriesGroupsModal from '../../../../views/subjecttypes/AddSubjectTypesModal'

const studyplans = () => {
  const URL_GET_PLANS = `${url.BASE_URL}/study-plans/`
  const URL_GET_PLAN_RECORDS = `${url.BASE_URL}/study-plan-records/`

  const router = useRouter()

  const {
    error: PlanError,
    data: Plans,
    setData: setPlans,
    loading: PlanLoading,
    reFetch: reFetchPlan
  } = useFetch(URL_GET_PLANS + router.query.curriculum_id)

  const [planSelected, setPlanSelected] = useState(0)
  // const [planCredit, setPlanCredit] = useState(0)

  const {
    error: PlanRecordsError,
    data: PlanRecords,
    setData: setPlanRecords,
    loading: PlanRecordLoading,
    reFetch: reFetchPlanRecords
  } = useFetch(URL_GET_PLAN_RECORDS + planSelected)

  const [yearSelected, setYearSelected] = useState(0)
  const years = [1, 2, 3, 4]

  const [semesterSelected, setSemesterSelected] = useState(0)
  const semesters = [1, 2, 3]

  const [open, setOpen] = useState(false) // for add new study plan
  const [openSub, setOpenSub] = useState(false) // for add new study sub plan

  useEffect(() => {
    if (planSelected) {
      const getPlanRecords = axios
        .get(URL_GET_PLAN_RECORDS + planSelected)
        .then(res => (res.data.status !== 404 ? res.data : { data: [] }))
        .catch(e => console.log(e))
      setPlanRecords(getPlanRecords.data)
      setYearSelected(1)
      setSemesterSelected(1)
    }
  }, [planSelected])

  const handleCreatePlan = (state, createBy, setIsDone, subPlans) => {
    if (state.curriculum_id < 1) {
      if (state.study_plan_name === '') return alert('Please Fill Plan Name')
      return alert('Please Choose Curriculum')
    } else {
      // 0 = no reference
      // 1 = with reference

      // if (createBy == 0) {
      const submitState = {
        curriculum_id: router.query.curriculum_id,
        study_plan_name: state.study_plan_name,
        study_plan_total_credit: 0
        // study_plan_version: 1
      }
      setIsDone(false)
      axios
        .post(URL_GET_PLANS, submitState)
        .then(res => {
          if (res.data.status === 201) {
            setIsDone(true)
            reFetchPlan()
            setTimeout(() => {
              setOpen(false)
              setPlanSelected(res.data.data.study_plan_id)
            }, 500)
          }
        })
        .catch(err => console.log(err))
      // console.log(state)
      // } else {
      //   const submitState = {
      //     curriculum_id: router.query.curriculum_id,
      //     study_plan_name: state.study_plan_name,
      //     study_plan_total_credit: state.study_plan_version,
      //     study_plan_version: state.study_plan_version
      //   }
      //   setIsDone(false)

      //   axios
      //     .post(URL_GET_PLANS, submitState)
      //     .then(res => {
      //       if (res.data.status === 201) {
      //         if (subPlans) {
      //           Object.values(subPlans)?.map(subPlan => {
      //             axios
      //               .post(
      //                 URL_GET_PLAN_RECORDS,

      //                 {
      //                   study_plan_id: res.data.data.study_plan_id,
      //                   subject_id: subPlan.subject_id !== null ? subPlan.subject_id : '',
      //                   study_plan_record_elective_course:
      //                     subPlan.study_plan_record_elective_course !== null
      //                       ? subPlan.study_plan_record_elective_course
      //                       : '',
      //                   study_plan_record_semester: subPlan.study_plan_record_semester,
      //                   study_plan_record_year: subPlan.study_plan_record_year
      //                 }
      //               )
      //               .then(res => {
      //                 // console.log(res.data.data)
      //               })
      //           })
      //         }
      //         setIsDone(true)
      //         reFetchPlan()
      //         setTimeout(() => {
      //           setOpen(false)
      //           setPlanSelected(res.data.data.study_plan_id)
      //         }, 500)
      //       }
      //     })
      //     .catch(err => console.log(err))
      // }
    }
  }
  // console.log(
  //   URL_GET_PLAN_RECORDS +
  //     Math.max.apply(
  //       null,
  //       Plans.map(function (o) {
  //         return o.study_plan_id
  //       })
  //     )
  // )
  // console.log(Plans)

  // const {
  //   error: CategoriesError,
  //   data: Categories,
  //   setData: setCategories,
  //   loading: CategoriesLoading,
  //   reFetch: reFetchCategories
  // } = useFetch(URL_GET_SUBJECT_CATEGORY)

  // const columnsSubjectType = ['subject_type_name', 'subject_category_name']

  // const [PlanRecordsTemp, setPlanRecordsTemp] = useState([])

  // const [searchText, setSearchText] = useState('')

  // const handleChangeSearch = text => {
  //   useSearchText(text, setPlanRecords, setSearchText, PlanRecordsTemp, columnsSubjectType)
  // }

  // useMemo(() => {
  //   if (!PlanLoading) {
  //     setPlanRecordsTemp(PlanRecords)
  //   } else {
  //   }
  // }, [PlanLoading])

  // const handleSubmit = submitState => {
  //   useSubmit(URL_INSERT, submitState, () => setOpen(false), reFetchPlanRecords)
  // }

  // const handleUpdate = updateState => {
  //   useUpdate(URL_UPDATE, updateState, () => setOpenEdit(false), reFetchPlanRecords)
  // }

  // const handleDelete = () => {
  //   useDelete(
  //     URL_DELETE,
  //     () => {
  //       setOpenConfirmDelete(false)
  //       setOpenEdit(false)
  //     },
  //     reFetchPlanRecords
  //   )
  // }

  // const loadingState = PlanLoading
  // const errorState = PlanRecordsError

  useEffect(() => {
    if (Plans.length > 0) {
      console.log(Plans)
      setPlanSelected(String(Plans[0]?.study_plan_id))

      // setPlanCredit(Plans[0].study_plan_total_credit)
    } else {
      setPlanSelected(0)
    }
  }, [Plans])

  if (PlanLoading && PlanRecordLoading) {
    return <CircleLoading />
  }
  if (PlanError && PlanRecordsError) {
    return <Box>Error Fetching...</Box>
  }

  if (PlanLoading !== null && !PlanLoading) {
    if (router.query.curriculum_id == undefined) return <Typography>404 Error</Typography>
  }

  const columns = [
    {
      field: 'subject_name',
      headerName: 'Subject',
      width: 400,
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
      width: 200,
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
      width: 200
    },
    {
      field: 'study_plan_record_semester',
      headerName: 'Semester',
      width: 200
    }
  ]

  return (
    <Box>
      {/* // header */}
      <Box display={'flex'} flexDirection={'row'}>
        <Typography variant='h6'>Study Plans {router.query.curriculum_name}</Typography>
      </Box>

      <Grid container spacing={2} sx={{ mt: 5 }}>
        {/* <Grid item xs={12} sm={4} md={4} lg={3}>
          <Box display={'flex'} flexDirection={'row'}>
            <TextSearch onChange={e => handleChangeSearch(e.target.value)} />
          </Box>
        </Grid> */}
        <Grid item xs={12} sm={6} md={4}>
          <Selection
            height={40}
            width={'100%'}
            label={'แผนการศึกษา'}
            disabled={true}
            firstItemText={Plans.length > 0 ? undefined : 'Please Create Plan'}
            selectionValue={planSelected}
            handleChange={e => {
              setPlanSelected(e.target.value)
            }}
            Items={Object.values(Plans)?.map(p => (
              <MenuItem key={p.study_plan_id} value={p.study_plan_id}>
                {p.study_plan_name}
              </MenuItem>
            ))}
          />
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <Selection
            height={40}
            width={'100%'}
            label={'Year'}
            // firstItemText={'Year'}
            selectionValue={yearSelected}
            handleChange={e => setYearSelected(e.target.value)}
            Items={years.map(y => (
              <MenuItem key={y} value={y}>
                {'ปี ' + y}
              </MenuItem>
            ))}
          />
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <Selection
            height={40}
            width={'100%'}
            label={'Semester'}
            // firstItemText={'Semester'}
            selectionValue={semesterSelected}
            handleChange={e => setSemesterSelected(e.target.value)}
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
        <Grid item xs={6} sm={6} md={2}>
          <Btn
            disabled={Plans.length > 0 ? true : false}
            fullWidth
            handleClick={() => setOpen(true)}
            label={'+ Create Plan'}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={4}>
          <Btn
            fullWidth
            handleClick={() => {
              planSelected !== 0 && Plans.length > 0 && setOpenSub(true)
            }}
            disabled={Plans.length > 0 ? false : true}
            label={'Sub Plan Management'}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={4}>
          <Typography sx={{ m: 2 }}>Total Credit: {Plans[0]?.study_plan_total_credit}</Typography>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12} sm={12} lg={12} mt={6} direction={'row'}>
          {PlanRecords?.length > 0 && (
            <Typography sx={{ ml: 1, color: 'gray' }}>
              {'Lasted Update '}

              {new Date(Plans[0]?.updated_at).toLocaleTimeString('en-TH')}
              {' ' +
                new Date(Plans[0]?.updated_at)
                  .toLocaleDateString('en-TH', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })
                  .split(' BE')[0]}
            </Typography>
          )}

          <DataGridTable
            rows={
              semesterSelected !== 3
                ? PlanRecords?.filter(
                    planFilter =>
                      planFilter.study_plan_record_year === yearSelected &&
                      planFilter.study_plan_record_semester === semesterSelected
                  )
                : PlanRecords?.filter(planFilter => planFilter.study_plan_record_year === yearSelected)
            }
            columns={columns}
            uniqueKey={'study_plan_record_id'}
            isLoading={PlanRecordLoading === null ? true : PlanRecordLoading}
            noData='ยังไม่มีรายการแผนการเรียน'
          />
        </Grid>
      </Grid>

      {/* <Grid container>
        <AddSubjectCategoriesGroupsModal
          open={open}
          Categories={Categories}
          handleClose={handleClose}
          handleSubmit={handleSubmit}
        />
      </Grid> */}

      {/* <Grid container>
        <EditSubjectCategoriesModal
          state={editState}
          open={openEdit}
          handleClose={handleCloseEdit}
          handleUpdate={handleUpdate}
          openConfirmDelete={handleOpenConfirmDelete}
          Categories={Categories}
        />
      </Grid> */}

      {/* <Grid container>
        <ConfirmModal
          title={`DELETE SubjectType Groups`}
          text={`Are you sure you want to delete ${editState.subject_type_name}?`}
          displayIcon={mdiAlertRhombus}
          submitLabel={'DELETE'}
          open={openConfirmDelete}
          handleClose={handleCloseConfirmDelete}
          handleSubmit={handleDelete}
        />
      </Grid> */}
      <Grid container>
        <Grid item>
          <AddStudyPlanModal
            open={open}
            handleClose={() => setOpen(false)}
            curriculumId={router.query.curriculum_id}
            handleSubmit={handleCreatePlan}
          />
        </Grid>
        <Grid item>
          <AddStudyPlanRecordsModal
            open={openSub}
            handleClose={() => setOpenSub(false)}
            allRecord={PlanRecords}
            setAllRecord={setPlanRecords}
            Plans={Plans}
            setPlans={setPlans}
            studyPlan={Plans[0]}
            year={yearSelected}
            semester={semesterSelected}
            // handleSubmit={handleCreatePlan}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default studyplans
