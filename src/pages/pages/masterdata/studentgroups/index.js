import React from 'react'
import { useFetch, useSubmit, useUpdate, useDelete } from 'src/hooks'
import { useMemo, useState } from 'react'

import { Btn, CircleLoading, ConfirmModal, DataGridTable, TextSearch } from 'src/components'
import { Box, Grid, Typography, Button } from '@mui/material'
import Icon from '@mdi/react'

import { mdiPen, mdiAlertRhombus } from '@mdi/js/'

import useSearchText from 'src/hooks/useSearchText'
import AddStudentGroupsModal from 'src/views/studentgroups/AddStudentGroupsModal'
import EditStudentGroupModal from 'src/views/studentgroups/EditStudentGroupModal'
import { url } from 'src/configs/urlConfig'

const Studentgroups = () => {
  const [open, setOpen] = useState(false)
  const [editState, setEditState] = useState([])

  const URL_GET_STUDENT_GROUPS = `${url.BASE_URL}/collegian-groups`

  const URL_INSERT = `${url.BASE_URL}/collegian-groups/`
  const URL_UPDATE = `${url.BASE_URL}/collegian-groups/${editState.collegian_group_id}`
  const URL_DELETE = `${url.BASE_URL}/collegian-groups/${editState.collegian_group_id}`

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

  const handleOpenConfirmDelete = () => {
    setOpenConfirmDelete(true)
  }

  const handleCloseConfirmDelete = () => {
    setOpenConfirmDelete(false)
  }

  const {
    error: StudentGroupsError,
    data: STUDENT_GROUPS,
    setData: setSTUDENT_GROUPS,
    loading: StudentGroupsLoading,
    reFetch: reFetchSTUDENT_GROUPS
  } = useFetch(URL_GET_STUDENT_GROUPS)

  const columnsStudentGroups = [
    'collegian_group_name_th',
    'collegian_group_name_en',
    'collegian_group_short_name_th',
    'collegian_group_short_name_en'
  ]

  const [STUDENT_GROUPSTemp, setSTUDENT_GROUPSTemp] = useState([])

  const [searchText, setSearchText] = useState('')

  const handleChangeSearch = text => {
    useSearchText(text, setSTUDENT_GROUPS, setSearchText, STUDENT_GROUPSTemp, columnsStudentGroups)
  }

  useMemo(() => {
    if (!StudentGroupsLoading) {
      setSTUDENT_GROUPSTemp(STUDENT_GROUPS)
    } else {
    }
  }, [StudentGroupsLoading])

  const handleSubmit = submitState => {
    useSubmit(URL_INSERT, submitState, () => setOpen(false), reFetchSTUDENT_GROUPS)
  }

  const handleUpdate = updateState => {
    useUpdate(URL_UPDATE, updateState, () => setOpenEdit(false), reFetchSTUDENT_GROUPS)
  }

  const handleDelete = () => {
    useDelete(
      URL_DELETE,
      () => {
        setOpenConfirmDelete(false)
        setOpenEdit(false)
      },
      reFetchSTUDENT_GROUPS
    )
  }

  const loadingState = StudentGroupsLoading
  const errorState = StudentGroupsError

  // if (loadingState) {
  //   return <CircleLoading />
  // }
  if (errorState) {
    return <Box>Error Fetching...</Box>
  }

  const columns = [
    { field: 'collegian_group_name_th', headerName: 'Group Name TH', width: 200 },
    { field: 'collegian_group_name_en', headerName: 'Group Name EN', width: 200 },
    { field: 'collegian_group_short_name_th', headerName: 'Group Short Name TH', width: 200 },
    { field: 'collegian_group_short_name_en', headerName: 'Group Short Name EN', width: 200 },
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
        </Grid>
      )
    }
  ]

  return (
    <Box>
      {/* // header */}
      <Box display={'flex'} flexDirection={'row'}>
        <Typography variant='h6'>Student Groups</Typography>
      </Box>

      <Grid container spacing={6} sx={{ mt: 5 }}>
        <Grid item xs={12} sm={4} md={4} lg={3}>
          <Box display={'flex'} flexDirection={'row'}>
            <TextSearch onChange={e => handleChangeSearch(e.target.value)} />
          </Box>
        </Grid>
        <Grid item xs={12} sm={4} md={4} lg={2}>
          <Btn handleclick={handleClickOpen} label={'+ Add New'} />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12} sm={12} lg={12} mt={6}>
          <DataGridTable
            rows={STUDENT_GROUPS}
            columns={columns}
            uniqueKey={'collegian_group_id'}
            isLoading={StudentGroupsLoading === null ? true : StudentGroupsLoading}
          />
        </Grid>
      </Grid>
      <Grid container>
        <AddStudentGroupsModal open={open} handleClose={handleClose} handleSubmit={handleSubmit} />
      </Grid>

      <Grid container>
        <EditStudentGroupModal
          state={editState}
          open={openEdit}
          handleClose={handleCloseEdit}
          handleUpdate={handleUpdate}
          openConfirmDelete={handleOpenConfirmDelete}
        />
      </Grid>

      <Grid container>
        <ConfirmModal
          title={`DELETE Student Groups`}
          text={`Are you sure you want to delete ${editState.collegian_group_name_th}?`}
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

export default Studentgroups
