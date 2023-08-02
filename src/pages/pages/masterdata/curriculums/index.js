import React from 'react'
import { MenuItem } from '@mui/material'
import { useFetch, useSubmit, useUpdate, useDelete } from 'src/hooks'
import { useMemo, useState } from 'react'

import { Btn, CircleLoading, ConfirmModal, DataGridTable, Selection, TextSearch } from 'src/components'
import { Box, Grid, Typography, Button } from '@mui/material'
import Icon from '@mdi/react'

import { mdiPen, mdiDownload, mdiDotsHorizontal, mdiAlertRhombus } from '@mdi/js/'

import AddCurriculumModal from './AddCurriculumModal'
import CurriculumEditModal from './CurriculumEditModal'
import CurriculumDetailsModal from './CurriculumDetailsModal'

const Curriculums = () => {
  const [open, setOpen] = useState(false)
  const [facultySelection, setFacultySelection] = useState(0)
  const [editState, setEditState] = useState([])

  const URL_GET_CURRICULUM = `https://my-backend-adonis.onrender.com/api/v1/curriculums/`
  const URL_GET_FACULTY = `https://my-backend-adonis.onrender.com/api/v1/faculties`
  const URL_GET_STUDENT_GROUPS = `https://my-backend-adonis.onrender.com/api/v1/collegian-groups`
  const URL_INSERT = `https://my-backend-adonis.onrender.com/api/v1/curriculums/`
  const URL_UPDATE = `https://my-backend-adonis.onrender.com/api/v1/curriculums/${editState.curriculum_id}`
  const URL_DELETE = `https://my-backend-adonis.onrender.com/api/v1/curriculums/${editState.curriculum_id}`

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const [openEdit, setOpenEdit] = useState(false)

  const handleClickOpenEdit = value => {
    setEditState(value)
    setOpenEdit(true)
  }

  const handleCloseEdit = () => {
    setOpenEdit(false)
  }

  const [openDetails, setOpenDetails] = useState(false)

  const handleClickOpenDetails = value => {
    setEditState(value)
    setOpenDetails(true)
  }

  const handleCloseDetails = () => {
    setOpenDetails(false)
  }

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false)

  const handleOpenConfirmDelete = () => {
    setOpenConfirmDelete(true)
  }

  const handleCloseConfirmDelete = () => {
    setOpenConfirmDelete(false)
  }

  const {
    error: CurriculumError,
    data: Curriculums,
    loading: CurriculumLoading,
    reFetch: reFetchCurriculums
  } = useFetch(URL_GET_CURRICULUM)

  const { error: FacultyError, data: Faculty, loading: FacultyLoading } = useFetch(URL_GET_FACULTY)

  const {
    error: StudentGroupsError,
    data: StudentGroups,
    loading: StudentGroupsLoading
  } = useFetch(URL_GET_STUDENT_GROUPS)

  const handleSubmit = submitState => {
    useSubmit(URL_INSERT, submitState, () => setOpen(false), reFetchCurriculums)
  }

  const handleUpdate = updateState => {
    useUpdate(URL_UPDATE, updateState, () => setOpenEdit(false), reFetchCurriculums)
  }

  const handleDelete = () => {
    useDelete(
      URL_DELETE,
      () => {
        setOpenConfirmDelete(false)
        setOpenEdit(false)
      },
      reFetchCurriculums
    )
  }

  const loadingState = CurriculumLoading && FacultyLoading && StudentGroupsLoading
  const errorState = CurriculumError && FacultyError && StudentGroupsError

  useMemo(() => {
    console.log(editState)
  }, [editState])

  useMemo(() => {
    console.log('Curriculums: ', Curriculums)
  }, [Curriculums])

  useMemo(() => {
    console.log('Faculty: ', Faculty)
  }, [Faculty])

  if (loadingState) {
    return <CircleLoading />
  }
  if (errorState) {
    return <Box>Error Fetching...</Box>
  }

  const columns = [
    { field: 'curriculum_year', headerName: 'Year', width: 100 },
    { field: 'curriculum_name_th', headerName: 'Curriculum Name TH', width: 210 },
    { field: 'curriculum_name_en', headerName: 'Curriculum Name EN', width: 230 },
    {
      field: 'faculty',
      headerName: 'Faculty',
      width: 130,
      valueGetter: params => params.row?.faculty?.faculty_name_th
    },
    {
      field: 'collegian_groups',
      headerName: 'Student',
      width: 100,
      valueGetter: params => params.row?.collegian_groups?.collegian_group_short_name_th
    },

    {
      field: 'fn',
      headerName: '',
      width: 300,
      renderCell: params => (
        <Grid container spacing={2}>
          <Grid item>
            <Button color='secondary' variant='outlined' onClick={() => handleClickOpenEdit(params.row)}>
              <Icon path={mdiPen} size={1} />
            </Button>
          </Grid>
          <Grid item>
            <Button color='secondary' variant='outlined'>
              <Icon path={mdiDownload} size={1} />
            </Button>
          </Grid>
          <Grid item>
            <Button color='secondary' variant='outlined' onClick={() => handleClickOpenDetails(params.row)}>
              <Icon path={mdiDotsHorizontal} size={1} />
            </Button>
          </Grid>
        </Grid>
      )
    }
  ]

  return (
    <Box>
      {/* // header */}
      <Typography variant='h6'>Curriculums</Typography>
      <Grid container spacing={5} sx={{ mt: 5 }} justifyContent={'start'}>
        <Grid item xs={12} sm={3} lg={3} minWidth={250}>
          <TextSearch />
        </Grid>
        <Grid item xs={12} sm={5} md={4} lg={4} minWidth={150}>
          <Selection
            label={'Faculty'}
            height={40}
            width={270}
            firstItemText={'แสดงทั้งหมด'}
            selectionValue={facultySelection}
            handleChange={e => setFacultySelection(e.target.value)}
            Items={Object.values(Faculty)?.map(fac => (
              <MenuItem key={fac.faculty_id} value={fac.faculty_id}>
                {fac.faculty_name_th}
              </MenuItem>
            ))}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={4} lg={2} minWidth={150}>
          <Btn handleClick={handleClickOpen} />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12} sm={12} lg={12} mt={6}>
          <DataGridTable rows={Curriculums} columns={columns} uniqueKey={'curriculum_id'} />
        </Grid>
      </Grid>
      <Grid container>
        <AddCurriculumModal
          open={open}
          handleClose={handleClose}
          handleSubmit={handleSubmit}
          curriculums={Curriculums}
          faculty={Faculty}
          studentGroups={StudentGroups}
        />
      </Grid>

      <Grid container>
        <CurriculumEditModal
          state={editState}
          open={openEdit}
          handleClose={handleCloseEdit}
          handleUpdate={handleUpdate}
          faculty={Faculty}
          studentGroups={StudentGroups}
          openConfirmDelete={handleOpenConfirmDelete}
        />
      </Grid>

      <Grid container>
        <CurriculumDetailsModal
          state={editState}
          open={openDetails}
          handleClose={handleCloseDetails}
          curriculumId={editState.curriculum_id}
        />
      </Grid>

      <Grid container>
        <ConfirmModal
          title={`DELETE CURRICULUM`}
          text={`Are you sure you want to delete ${editState.curriculum_name_th}?`}
          displayIcon={mdiAlertRhombus}
          submitLabel={'DELETE'}
          open={openConfirmDelete}
          handleClose={handleCloseConfirmDelete}
          handleSubmit={handleDelete}
        />
      </Grid>
    </Box>
  )
}

export default Curriculums
