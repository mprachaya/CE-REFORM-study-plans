import React from 'react'
import { useFetch, useSubmit, useUpdate, useDelete } from 'src/hooks'
import { useMemo, useState } from 'react'

import { Btn, CircleLoading, ConfirmModal, DataGridTable, TextSearch } from 'src/components'
import { Box, Grid, Typography, Button } from '@mui/material'
import Icon from '@mdi/react'

import { mdiPen, mdiAlertRhombus } from '@mdi/js/'

import useSearchText from 'src/hooks/useSearchText'
import { url } from 'src/configs/urlConfig'
import EditSubjectCategoriesModal from '../../../../views/subjecttypes/EditSubjectTypesModal'
import AddSubjectCategoriesGroupsModal from '../../../../views/subjecttypes/AddSubjectTypesModal'

const subjecttypes = () => {
  const [open, setOpen] = useState(false)
  const [editState, setEditState] = useState([])

  const URL_GET_SUBJECT_TYPES = `${url.BASE_URL}/subject-types/`
  const URL_GET_SUBJECT_CATEGORY = `${url.BASE_URL}/subject-categories/`

  const URL_INSERT = `${url.BASE_URL}/subject-types/`
  const URL_UPDATE = `${url.BASE_URL}/subject-types/${editState.subject_type_id}`
  const URL_DELETE = `${url.BASE_URL}/subject-types/${editState.subject_type_id}`

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
    error: SubjectTypeError,
    data: SUBJECT_TYPES,
    setData: setSUBJECT_TYPES,
    loading: SubjectTypeLoading,
    reFetch: reFetchSUBJECT_TYPES
  } = useFetch(URL_GET_SUBJECT_TYPES)

  const {
    error: CategoriesError,
    data: Categories,
    setData: setCategories,
    loading: CategoriesLoading,
    reFetch: reFetchCategories
  } = useFetch(URL_GET_SUBJECT_CATEGORY)

  const columnsSubjectType = ['subject_type_name', 'subject_category_name']

  const [SUBJECT_TYPESTemp, setSUBJECT_TYPESTemp] = useState([])

  const [searchText, setSearchText] = useState('')

  const handleChangeSearch = text => {
    useSearchText(text, setSUBJECT_TYPES, setSearchText, SUBJECT_TYPESTemp, columnsSubjectType)
  }

  useMemo(() => {
    if (!SubjectTypeLoading) {
      setSUBJECT_TYPESTemp(SUBJECT_TYPES)
    } else {
    }
  }, [SubjectTypeLoading])

  const handleSubmit = submitState => {
    useSubmit(URL_INSERT, submitState, () => setOpen(false), reFetchSUBJECT_TYPES)
  }

  const handleUpdate = updateState => {
    useUpdate(URL_UPDATE, updateState, () => setOpenEdit(false), reFetchSUBJECT_TYPES)
  }

  const handleDelete = () => {
    useDelete(
      URL_DELETE,
      () => {
        setOpenConfirmDelete(false)
        setOpenEdit(false)
      },
      reFetchSUBJECT_TYPES
    )
  }

  const loadingState = SubjectTypeLoading
  const errorState = SubjectTypeError

  if (loadingState && CategoriesLoading) {
    return <CircleLoading />
  }
  if (errorState && CategoriesError) {
    return <Box>Error Fetching...</Box>
  }

  const columns = [
    { field: 'subject_type_name', headerName: 'Type Name', width: 200 },
    {
      field: 'subject_category_name',
      headerName: 'Category Name',
      width: 200,
      valueGetter: params => params.row?.subject_categories.subject_category_name
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
          {SUBJECT_TYPES.length !== 0 ? (
            <DataGridTable rows={SUBJECT_TYPES} columns={columns} uniqueKey={'subject_type_id'} />
          ) : (
            <Typography>ยังไม่มีข้อมูลประเภทวิชาอยู่ในระบบ</Typography>
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
          title={`DELETE SubjectType Groups`}
          text={`Are you sure you want to delete ${editState.subject_type_name}?`}
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

export default subjecttypes
