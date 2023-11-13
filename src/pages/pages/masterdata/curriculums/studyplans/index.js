import React, { useEffect } from 'react'
import { useFetch, useSubmit, useUpdate, useDelete } from 'src/hooks'
import { useMemo, useState } from 'react'

import { Btn, CircleLoading, ConfirmModal, DataGridTable, Selection, TextSearch } from 'src/components'
import { Box, Grid, Typography, Button, MenuItem } from '@mui/material'
import Icon from '@mdi/react'

import { mdiPen, mdiAlertRhombus } from '@mdi/js/'

import useSearchText from 'src/hooks/useSearchText'
import { url } from 'src/configs/urlConfig'
import { useRouter } from 'next/router'
import axios from 'axios'
import AddStudyPlanModal from 'src/views/curriculums/AddStudyPlanModal'
// import EditSubjectCategoriesModal from '../../../../views/subjecttypes/EditSubjectTypesModal'
// import AddSubjectCategoriesGroupsModal from '../../../../views/subjecttypes/AddSubjectTypesModal'

const studyplans = () => {
  // const [open, setOpen] = useState(false)
  // const [editState, setEditState] = useState([])
  const URL_GET_PLANS = `${url.BASE_URL}/study-plans/`
  const URL_GET_PLAN_RECORDS = `${url.BASE_URL}/study-plan-records/`

  const router = useRouter()
  // const URL_GET_SUBJECT_CATEGORY = `${url.BASE_URL}/subject-categories/`

  // const URL_INSERT = `${url.BASE_URL}/subject-types/`
  // const URL_UPDATE = `${url.BASE_URL}/subject-types/${editState.subject_type_id}`
  // const URL_DELETE = `${url.BASE_URL}/subject-types/${editState.subject_type_id}`

  // const handleClose = setInitialState => {
  //   setOpen(false)
  //   setInitialState
  // }

  // const [openEdit, setOpenEdit] = useState(false)

  // const handleClickOpenEdit = value => {
  //   setEditState(value)
  //   setOpenEdit(true)
  // }

  // const handleCloseEdit = setInitialState => {
  //   setOpenEdit(false)
  //   setInitialState
  // }

  // const [openDetails, setOpenDetails] = useState(false)

  // const [openConfirmDelete, setOpenConfirmDelete] = useState(false)

  // const handleOpenConfirmDelete = () => {
  //   setOpenConfirmDelete(true)
  // }

  // const handleCloseConfirmDelete = () => {
  //   setOpenConfirmDelete(false)
  // }

  const {
    error: PlanError,
    data: Plans,
    setData: setPlan,
    loading: PlanLoading,
    reFetch: reFetchPlan
  } = useFetch(URL_GET_PLANS + router.query.curriculum_id)

  const [planSelected, setPlanSelected] = useState(0)
  const [planCredit, setPlanCredit] = useState(0)
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
      if (state.study_plan_name === '') return alert('Please Choose Curriculum and Fill Plan Name')
      return alert('Please Choose Curriculum')
    } else {
      // 0 = no reference
      // 1 = with reference

      if (createBy == 0) {
        const submitState = {
          curriculum_id: router.query.curriculum_id,
          study_plan_name: state.study_plan_name,
          study_plan_total_credit: 0,
          study_plan_version: 1
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
      } else {
        const submitState = {
          curriculum_id: router.query.curriculum_id,
          study_plan_name: state.study_plan_name,
          study_plan_total_credit: state.study_plan_version,
          study_plan_version: state.study_plan_version
        }
        setIsDone(false)

        axios
          .post(URL_GET_PLANS, submitState)
          .then(res => {
            if (res.data.status === 201) {
              if (subPlans) {
                Object.values(subPlans)?.map(subPlan => {
                  axios
                    .post(
                      URL_GET_PLAN_RECORDS,

                      {
                        study_plan_id: res.data.data.study_plan_id,
                        subject_id: subPlan.subject_id !== null ? subPlan.subject_id : '',
                        study_plan_record_elective_course:
                          subPlan.study_plan_record_elective_course !== null
                            ? subPlan.study_plan_record_elective_course
                            : '',
                        study_plan_record_semester: subPlan.study_plan_record_semester,
                        study_plan_record_year: subPlan.study_plan_record_year
                      }
                    )
                    .then(res => {
                      // console.log(res.data.data)
                    })
                })
              }
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
      }
      // createBy.id == 1 ?
      // : console.log('error create plan');
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

  // if (loadingState && CategoriesLoading) {
  //   return <CircleLoading />
  // }
  // if (errorState && CategoriesError) {
  //   return <Box>Error Fetching...</Box>
  // }

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
          return params.row.subjects.subject_name_th + ' (' + params.row.subjects?.subject_name_en + ')'
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
    // {
    //   field: 'fn',
    //   headerName: '',
    //   width: 200,
    //   renderCell: params => (
    //     <Grid container spacing={2}>
    //       <Grid item>
    //         <Button color='secondary' variant='outlined' onClick={() => handleClickOpenEdit(params.row)}>
    //           <Icon path={mdiPen} size={1} />
    //         </Button>
    //       </Grid>
    //     </Grid>
    //   )
    // }
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
        <Grid item xs={12} sm={6} md={2.5}>
          <Selection
            height={40}
            width={'100%'}
            firstItemText={'Select Plan'}
            selectionValue={planSelected}
            handleChange={e => {
              setPlanSelected(e.target.value)
            }}
            Items={Object.values(Plans)?.map(p => (
              <MenuItem
                key={p.study_plan_id}
                value={p.study_plan_id}
                onClick={() => setPlanCredit(p.study_plan_total_credit)}
              >
                {p.study_plan_name + ' Version(' + p.study_plan_version + ')'}
              </MenuItem>
            ))}
          />
        </Grid>
        <Grid item xs={6} sm={3} md={1.5}>
          <Selection
            height={40}
            width={'100%'}
            firstItemText={'Year'}
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
            firstItemText={'Semester'}
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
        <Grid item xs={6} sm={6} md={3}>
          <Btn fullWidth handleClick={() => setOpen(true)} label={'+ Add New Plan'} />
        </Grid>
        <Grid item xs={6} sm={6} md={4}>
          <Btn fullWidth handleClick={() => setOpenSub(true)} label={'+ Add New Sub Plan'} />
        </Grid>
        <Grid item xs={6} sm={6} md={4}>
          <Typography sx={{ m: 2 }}>Total Credit: {planCredit}</Typography>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12} sm={12} lg={12} mt={6}>
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
      </Grid>
    </Box>
  )
}

export default studyplans
