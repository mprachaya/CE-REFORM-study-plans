import React from 'react'
import { useFetch, useSubmit, useUpdate, useDelete } from 'src/hooks'
import { useMemo, useState } from 'react'

import { Btn, CircleLoading, ConfirmModal, DataGridTable, TextSearch } from 'src/components'
import { Box, Grid, Typography, Button } from '@mui/material'
import Icon from '@mdi/react'

import { mdiPen, mdiAlertRhombus, mdiDotsHorizontal } from '@mdi/js/'

import useSearchText from 'src/hooks/useSearchText'
import AddFacultyModal from 'src/views/faculty/AddFacultyModal'
import EditFacultyModal from 'src/views/faculty/EditFacultyModal'
import { url } from 'src/configs/urlConfig'
import FacultyDetailsModal from 'src/views/faculty/FacultyDetails'

const faculty = () => {
  const [open, setOpen] = useState(false)
  const [editState, setEditState] = useState([])

  const URL_GET_FACULTY = `${url.BASE_URL}/faculties`

  const URL_INSERT = `${url.BASE_URL}/faculties/`
  const URL_UPDATE = `${url.BASE_URL}/faculties/${editState.faculty_id}`
  const URL_DELETE = `${url.BASE_URL}/faculties/${editState.faculty_id}`

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = setInitialState => {
    setOpen(false)
    setInitialState
  }

  const [openEdit, setOpenEdit] = useState(false)

  const handleClickOpenEdit = value => {
    setEditState(value)
    setOpenEdit(true)
  }

  const handleCloseEdit = setInitialState => {
    setOpenEdit(false)
    setInitialState
  }

  const [openDetails, setOpenDetails] = useState(false)

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false)

  const handleClickOpenDetails = value => {
    setEditState(value)
    setOpenDetails(true)
  }

  const handleCloseDetails = () => {
    setOpenDetails(false)
  }

  const handleOpenConfirmDelete = () => {
    setOpenConfirmDelete(true)
  }

  const handleCloseConfirmDelete = () => {
    setOpenConfirmDelete(false)
  }

  const {
    error: FacultyError,
    data: FACULTY,
    setData: setFACULTY,
    loading: FacultyLoading,
    reFetch: reFetchFACULTY
  } = useFetch(URL_GET_FACULTY)

  const columnsFaculty = ['faculty_name_th', 'faculty_name_en']

  const [FACULTYTemp, setFACULTYTemp] = useState([])

  const [searchText, setSearchText] = useState('')

  const handleChangeSearch = text => {
    useSearchText(text, setFACULTY, setSearchText, FACULTYTemp, columnsFaculty)
  }

  useMemo(() => {
    if (!FacultyLoading) {
      setFACULTYTemp(FACULTY)
    } else {
    }
  }, [FacultyLoading])

  const handleSubmit = submitState => {
    useSubmit(URL_INSERT, submitState, () => setOpen(false), reFetchFACULTY)
  }

  const handleUpdate = updateState => {
    useUpdate(URL_UPDATE, updateState, () => setOpenEdit(false), reFetchFACULTY)
  }

  const handleDelete = () => {
    useDelete(
      URL_DELETE,
      () => {
        setOpenConfirmDelete(false)
        setOpenEdit(false)
      },
      reFetchFACULTY
    )
  }

  const loadingState = FacultyLoading
  const errorState = FacultyError

  if (loadingState) {
    return <CircleLoading />
  }
  if (errorState) {
    return <Box>Error Fetching...</Box>
  }

  const columns = [
    { field: 'faculty_name_th', headerName: 'Faculty Name TH', width: 300 },
    { field: 'faculty_name_en', headerName: 'Faculty Name EN', width: 300 },
    {
      field: 'fn',
      headerName: '',
      width: 200,
      renderCell: params => (
        <Grid container spacing={2}>
          <Grid item>
            <Button color='secondary' variant='outlined' onClick={() => handleClickOpenEdit(params.row)}>
              <Icon path={mdiPen} size={1} />
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
      <Box display={'flex'} flexDirection={'row'}>
        <Typography variant='h6'>Faculty</Typography>
      </Box>

      <Grid container spacing={6} sx={{ mt: 5 }}>
        <Grid item xs={12} sm={4} md={4} lg={3}>
          <Box display={'flex'} flexDirection={'row'}>
            <TextSearch onChange={e => handleChangeSearch(e.target.value)} />
          </Box>
        </Grid>
        <Grid item xs={12} sm={4} md={4} lg={8}>
          <Btn handleClick={handleClickOpen} label={'+ Add New'} />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12} sm={12} lg={12} mt={6}>
          {FACULTY.length !== 0 ? (
            <DataGridTable rows={FACULTY} columns={columns} uniqueKey={'faculty_id'} />
          ) : (
            <Typography>ยังไม่มีคณะอยู่ในระบบ</Typography>
          )}
        </Grid>
      </Grid>
      <Grid container>
        <AddFacultyModal open={open} handleClose={handleClose} handleSubmit={handleSubmit} />
      </Grid>

      <Grid container>
        <EditFacultyModal
          state={editState}
          open={openEdit}
          handleClose={handleCloseEdit}
          handleUpdate={handleUpdate}
          openConfirmDelete={handleOpenConfirmDelete}
        />
      </Grid>
      <Grid container>
        <FacultyDetailsModal
          state={editState}
          open={openDetails}
          handleClose={handleCloseDetails}
          facultyId={editState.faculty_id}
        />
      </Grid>
      <Grid container>
        <ConfirmModal
          title={`DELETE Faculty`}
          text={`Are you sure you want to delete ${editState.faculty_name_th}?`}
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

export default faculty
