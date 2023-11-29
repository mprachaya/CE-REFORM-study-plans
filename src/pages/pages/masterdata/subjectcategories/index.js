import React from 'react'
import { useFetch as UseFetch, useSubmit as UseSubmit, useUpdate as UseUpdate, useDelete as UseDelete,useSearchText as UseSearchText} from 'src/hooks'
import { useMemo, useState } from 'react'

import { Btn, CircleLoading, ConfirmModal, DataGridTable, TextSearch } from 'src/components'
import { Box, Grid, Typography, Button } from '@mui/material'
import Icon from '@mdi/react'

import { mdiPen, mdiAlertRhombus } from '@mdi/js/'

import { url } from 'src/configs/urlConfig'
import EditSubjectCategoriesModal from '../../../../views/subjectcategories/EditSubjectCategoriesModal'
import AddSubjectCategoriesGroupsModal from '../../../../views/subjectcategories/AddSubjectCategoriesModal'

const Subjectcategories = () => {
  const [open, setOpen] = useState(false)
  const [editState, setEditState] = useState([])

  const URL_GET_SUBJECT_CATEGORY = `${url.BASE_URL}/subject-categories/`

  const URL_INSERT = `${url.BASE_URL}/subject-categories/`
  const URL_UPDATE = `${url.BASE_URL}/subject-categories/${editState.subject_category_id}`
  const URL_DELETE = `${url.BASE_URL}/subject-categories/${editState.subject_category_id}`

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
    error: SubjectCategoryError,
    data: SUBJECT_CATEGORY,
    setData: setSUBJECT_CATEGORY,
    loading: SubjectCategoryLoading,
    reFetch: reFetchSUBJECT_CATEGORY
  } = UseFetch(URL_GET_SUBJECT_CATEGORY)

  const columnsSubjectCategory = ['subject_category_name']

  const [SUBJECT_CATEGORYTemp, setSUBJECT_CATEGORYTemp] = useState([])

  const [searchText, setSearchText] = useState('')

  const handleChangeSearch = text => {
    UseSearchText(text, setSUBJECT_CATEGORY, setSearchText, SUBJECT_CATEGORYTemp, columnsSubjectCategory)
  }

  useMemo(() => {
    if (!SubjectCategoryLoading) {
      setSUBJECT_CATEGORYTemp(SUBJECT_CATEGORY)
    } else {
    }
  }, [SubjectCategoryLoading])

  const handleSubmit = submitState => {
    UseSubmit(URL_INSERT, submitState, () => setOpen(false), reFetchSUBJECT_CATEGORY)
  }

  const handleUpdate = updateState => {
    UseUpdate(URL_UPDATE, updateState, () => setOpenEdit(false), reFetchSUBJECT_CATEGORY)
  }

  const handleDelete = () => {
    UseDelete(
      URL_DELETE,
      () => {
        setOpenConfirmDelete(false)
        setOpenEdit(false)
      },
      reFetchSUBJECT_CATEGORY
    )
  }

  const loadingState = SubjectCategoryLoading
  const errorState = SubjectCategoryError

  // if (loadingState) {
  //   return <CircleLoading />
  // }
  if (errorState) {
    return <Box>Error Fetching...</Box>
  }

  const columns = [
    { field: 'subject_category_name', headerName: 'Category Name', width: 200 },
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
        <Typography variant='h6'>Subject Category</Typography>
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
            rows={SUBJECT_CATEGORY}
            columns={columns}
            uniqueKey={'subject_category_id'}
            isLoading={SubjectCategoryLoading === null ? true : SubjectCategoryLoading}
          />
        </Grid>
      </Grid>
      <Grid container>
        <AddSubjectCategoriesGroupsModal open={open} handleClose={handleClose} handleSubmit={handleSubmit} />
      </Grid>

      <Grid container>
        <EditSubjectCategoriesModal
          state={editState}
          open={openEdit}
          handleClose={handleCloseEdit}
          handleUpdate={handleUpdate}
          openConfirmDelete={handleOpenConfirmDelete}
        />
      </Grid>

      <Grid container>
        <ConfirmModal
          title={`DELETE SubjectCategory Groups`}
          text={`Are you sure you want to delete ${editState.subject_category_name}?`}
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

export default Subjectcategories
