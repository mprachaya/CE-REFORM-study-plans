import React from 'react'
import { useFetch, useSubmit, useUpdate, useDelete } from 'src/hooks'
import { useMemo, useState } from 'react'

import { Btn, CircleLoading, ConfirmModal, DataGridTable, Selection, TextSearch } from 'src/components'
import { Box, Grid, Typography, Button } from '@mui/material'
import Icon from '@mdi/react'

import { mdiPen, mdiAlertRhombus } from '@mdi/js/'

import useSearchText from 'src/hooks/useSearchText'
import { url } from 'src/configs/urlConfig'
// import EditSubjectCategoriesModal from '../../../../views/subjecttypes/EditSubjectTypesModal'
// import AddSubjectCategoriesGroupsModal from '../../../../views/subjecttypes/AddSubjectTypesModal'

const studyplans = () => {
  // const [open, setOpen] = useState(false)
  // const [editState, setEditState] = useState([])

  const URL_GET_PLAN_RECORDS = `${url.BASE_URL}/study-plan-records/`
  // const URL_GET_SUBJECT_CATEGORY = `${url.BASE_URL}/subject-categories/`

  // const URL_INSERT = `${url.BASE_URL}/subject-types/`
  // const URL_UPDATE = `${url.BASE_URL}/subject-types/${editState.subject_type_id}`
  // const URL_DELETE = `${url.BASE_URL}/subject-types/${editState.subject_type_id}`

  const handleClickOpen = () => {
    setOpen(true)
  }

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
    error: PlanRecordsError,
    data: PlanRecords,
    setData: setPlanRecords,
    loading: PlanLoading,
    reFetch: reFetchPlanRecords
  } = useFetch(URL_GET_PLAN_RECORDS)

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
    if (PlanRecords.length === 0) return <Typography>ยังไม่มีข้อมูลแผนในระบบ</Typography>
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
      headerName: 'Semester',
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
        <Typography variant='h6'>Study Plans</Typography>
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
            firstItemText={'Plan Name'}
            // selectionValue={String(updateState.collegian_group_id)}
            // handleChange={e => setUpdateState(pre => ({ ...pre, collegian_group_id: parseInt(e.target.value) }))}
            // Items={Object.values(studentGroups)?.map(stdg => (
            //   <MenuItem key={stdg.collegian_group_id} value={stdg.collegian_group_id}>
            //     {stdg.collegian_group_short_name_th}
            //   </MenuItem>
            // ))}
          />
        </Grid>
        <Grid item xs={6} sm={3} md={1.5}>
          <Selection height={40} width={'100%'} firstItemText={'Year'} />
        </Grid>
        <Grid item xs={6} sm={3} md={1.5}>
          <Selection height={40} width={'100%'} firstItemText={'Semester'} />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Btn fullWidth handleClick={handleClickOpen} label={'+ Add New Plan'} />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Btn fullWidth handleClick={handleClickOpen} label={'+ Add New Sub Plan'} />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12} sm={12} lg={12} mt={6}>
          <DataGridTable
            rows={PlanRecords}
            columns={columns}
            uniqueKey={'study_plan_record_id'}
            isLoading={PlanLoading === null ? true : PlanLoading}
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
    </Box>
  )
}

export default studyplans
