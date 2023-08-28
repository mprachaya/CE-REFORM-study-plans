import React from 'react'
import { useFetch, useSubmit, useUpdate, useDelete } from 'src/hooks'
import { useMemo, useState } from 'react'

import { Btn, CircleLoading, ConfirmModal, DataGridTable, TextSearch } from 'src/components'
import { Box, Grid, Typography, Button } from '@mui/material'
import Icon from '@mdi/react'

import { mdiPen, mdiAlertRhombus } from '@mdi/js/'

import useSearchText from 'src/hooks/useSearchText'
import { url } from 'src/configs/urlConfig'
import EditSubjectCategoriesModal from './EditSubjectGroupsModal'
import AddSubjectCategoriesGroupsModal from './AddSubjectGroupsModal'

const subjectgroups = () => {
  const [open, setOpen] = useState(false)
  const [editState, setEditState] = useState([])

  const URL_GET_SUBJECT_GROUPS = `${url.BASE_URL}/subject-groups/`
  const URL_GET_SUBJECT_CATEGORY = `${url.BASE_URL}/subject-types/`

  const URL_INSERT = `${url.BASE_URL}/subject-groups/`
  const URL_UPDATE = `${url.BASE_URL}/subject-groups/${editState.subject_group_id}`
  const URL_DELETE = `${url.BASE_URL}/subject-groups/${editState.subject_group_id}`

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
    error: SubjectGroupError,
    data: SUBJECT_GROUPS,
    setData: setSUBJECT_GROUPS,
    loading: SubjectGroupLoading,
    reFetch: reFetchSUBJECT_GROUPS
  } = useFetch(URL_GET_SUBJECT_GROUPS)

  const {
    error: CategoriesError,
    data: Categories,
    setData: setCategories,
    loading: CategoriesLoading,
    reFetch: reFetchCategories
  } = useFetch(URL_GET_SUBJECT_CATEGORY)

  const columnsSubjectType = ['subject_group_name', 'subject_type_name']

  const [SUBJECT_GROUPSTemp, setSUBJECT_GROUPSTemp] = useState([])

  const [searchText, setSearchText] = useState('')

  const handleChangeSearch = text => {
    useSearchText(text, setSUBJECT_GROUPS, setSearchText, SUBJECT_GROUPSTemp, columnsSubjectType)
  }

  useMemo(() => {
    if (!SubjectGroupLoading) {
      setSUBJECT_GROUPSTemp(SUBJECT_GROUPS)
    } else {
    }
  }, [SubjectGroupLoading])

  const handleSubmit = submitState => {
    useSubmit(URL_INSERT, submitState, () => setOpen(false), reFetchSUBJECT_GROUPS)
  }

  const handleUpdate = updateState => {
    useUpdate(URL_UPDATE, updateState, () => setOpenEdit(false), reFetchSUBJECT_GROUPS)
  }

  const handleDelete = () => {
    useDelete(
      URL_DELETE,
      () => {
        setOpenConfirmDelete(false)
        setOpenEdit(false)
      },
      reFetchSUBJECT_GROUPS
    )
  }

  const loadingState = SubjectGroupLoading
  const errorState = SubjectGroupError

  if (loadingState && CategoriesLoading) {
    return <CircleLoading />
  }
  if (errorState && CategoriesError) {
    return <Box>Error Fetching...</Box>
  }

  const columns = [
    { field: 'subject_group_name', headerName: 'Group Name', width: 200 },
    {
      field: 'subject_type_name',
      headerName: 'Type Name',
      width: 200,
      valueGetter: params => params.row?.subject_types.subject_type_name
    },
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
        <Typography variant='h6'>Subject Type</Typography>
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
          {SUBJECT_GROUPS.length !== 0 ? (
            <DataGridTable rows={SUBJECT_GROUPS} columns={columns} uniqueKey={'subject_group_id'} />
          ) : (
            <Typography>ยังไม่มีข้อมูลกลุ่มวิชาอยู่ในระบบ</Typography>
          )}
        </Grid>
      </Grid>
      <Grid container>
        <AddSubjectCategoriesGroupsModal
          open={open}
          Categories={Categories}
          handleClose={handleClose}
          handleSubmit={handleSubmit}
        />
      </Grid>

      <Grid container>
        <EditSubjectCategoriesModal
          state={editState}
          open={openEdit}
          handleClose={handleCloseEdit}
          handleUpdate={handleUpdate}
          openConfirmDelete={handleOpenConfirmDelete}
          Categories={Categories}
        />
      </Grid>

      <Grid container>
        <ConfirmModal
          title={`DELETE Subject Group`}
          text={`Are you sure you want to delete ${editState.subject_group_name}?`}
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

export default subjectgroups
