import React, { useEffect } from 'react'
import { Hidden, MenuItem } from '@mui/material'
import {
  useFetch as UseFetch,
  useSubmit as UseSubmit,
  useUpdate as UseUpdate,
  useDelete as UseDelete,
  useSearchText as UseSearchText
} from 'src/hooks'
import { useMemo, useState } from 'react'

import { Btn, CircleLoading, ConfirmModal, DataGridTable, Selection, TextSearch } from 'src/components'
import { Box, Grid, Typography, Button } from '@mui/material'
import Icon from '@mdi/react'

import { mdiPen, mdiAlertRhombus, mdiFilter, mdiCircle } from '@mdi/js/'

import useFilter from 'src/hooks/useFilter'
import { useRouter } from 'next/router'
import AddSubjectModal from '../../../../views/subjects/AddSubjectModal'
import EditSubjectModal from '../../../../views/subjects/EditSubjectModal'
import AddSubjectCompetency from 'src/views/competencies/AddSubjectCompetency'
import curriculums from '../curriculums'
import AddContinueSubjects from 'src/views/continue-subjects/AddContinueSubjects'
import { url } from 'src/configs/urlConfig'

const Subjects = () => {
  const [open, setOpen] = useState(false)
  const [openCompetency, setOpenCompetency] = useState(false)
  const [openContinueSubject, setOpenContinueSubject] = useState(false)
  const [subjectSelection, setSubjectSelection] = useState([])
  const [subjectGroupSelection, setSubjectGroupSelection] = useState(0)
  const [editState, setEditState] = useState([])
  const router = useRouter()

  const URL_GET_SUBJECTS = `${url.BASE_URL}/subjects-by-curriculum/${router.query.curriculum_id}`
  const URL_GET_SUBJECT_GROUPS = `${url.BASE_URL}/subject-groups/`
  const URL_GET_CURRICULUM = `${url.BASE_URL}/curriculums/`

  const URL_INSERT = `${url.BASE_URL}/subjects/`
  const URL_UPDATE = `${url.BASE_URL}/subjects/${editState.subject_id}`
  const URL_DELETE = `${url.BASE_URL}/subjects/${editState.subject_id}`

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

  const handleClickOpenCompetency = subject => {
    setOpenCompetency(true)
    setSubjectSelection(subject)
  }

  const handleClickOpenContinueSubjects = subject => {
    setOpenContinueSubject(true)
    setSubjectSelection(subject)
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
    error: CurriculumError,
    data: Curriculums,
    setData: setCurriculums,
    loading: CurriculumLoading,
    reFetch: reFetchCurriculums
  } = UseFetch(URL_GET_CURRICULUM)

  const {
    error: SubjectError,
    data: Subjects,
    setData: setSubjects,
    loading: SubjectLoading,
    reFetch: reFetchSubjects
  } = UseFetch(URL_GET_SUBJECTS)

  const columnsSubject = ['subject_code', 'subject_name_th', 'subject_name_en', 'subject_credit', 'subject_group_id']

  const [SubjectsTemp, setSubjectsTemp] = useState([])

  const [searchText, setSearchText] = useState('')

  const handleChangeSearch = text => {
    UseSearchText(text, setSubjects, setSearchText, SubjectsTemp, columnsSubject)
  }

  const handleChangeFilter = value => {
    setSubjectGroupSelection(value)
    UseFilter(value, 'subject_group_id', setSubjects, SubjectsTemp)
  }

  useMemo(() => {
    if (!SubjectLoading) {
      setSubjectsTemp(Subjects)
    } else {
    }
  }, [SubjectLoading])

  const {
    error: SubjectGroupError,
    data: SubjectGroup,
    loading: SubjectGroupLoading
  } = UseFetch(URL_GET_SUBJECT_GROUPS)

  const handleSubmit = submitState => {
    UseSubmit(URL_INSERT, submitState, () => setOpen(false), reFetchSubjects)
  }

  const handleUpdate = updateState => {
    UseUpdate(URL_UPDATE, updateState, () => setOpenEdit(false), reFetchSubjects)
  }

  const handleDelete = () => {
    UseDelete(
      URL_DELETE,
      () => {
        setOpenConfirmDelete(false)
        setOpenEdit(false)
      },
      reFetchSubjects
    )
  }

  useEffect(() => {
    if (router.query.curriculum_id) {
      return
    } else {
      router.push('/pages/masterdata/curriculums')
    }
  }, [])

  useMemo(() => {
    if (Subjects) console.log(Subjects)
  }, [Subjects])

  const loadingState = SubjectLoading || SubjectGroupLoading || CurriculumLoading
  const errorState = SubjectError || SubjectGroupError || CurriculumError

  if (loadingState) {
    return <CircleLoading />
  }
  if (errorState) {
    return <Box>Error Fetching...</Box>
  }

  const columns = [
    { field: 'subject_code', headerName: 'Code', width: 100 },
    { field: 'subject_name_th', headerName: 'Name TH', width: 210 },
    {
      field: 'subject_credit',
      headerName: 'Credit',
      width: 130
    },
    {
      field: 'subject_groups',
      headerName: 'Group',
      width: 300,
      valueGetter: params => params.row?.subject_groups?.subject_group_name
    },

    {
      field: 'fn',
      headerName: '',
      width: 500,
      renderCell: params => (
        <Grid container spacing={2}>
          <Grid item>
            <Button color='secondary' variant='outlined' onClick={() => handleClickOpenEdit(params.row)}>
              <Icon path={mdiPen} size={1} />
            </Button>
          </Grid>
          <Grid item>
            <Button
              color='secondary'
              variant='outlined'
              endIcon={
                <Icon path={mdiCircle} size={0.4} color={params.row.competencies.length > 0 ? 'green' : 'red'} />
              }
              onClick={() => handleClickOpenCompetency(params.row)}
            >
              สมรรถนะ
            </Button>
          </Grid>
          <Grid item>
            <Button
              color='secondary'
              variant='outlined'
              onClick={() => {
                handleClickOpenContinueSubjects(params.row)
              }}
            >
              วิชาต่อเนื่อง
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
        <Typography variant='h6'>Subjects</Typography>
      </Box>
      <Grid container spacing={6} sx={{ mt: 5 }}>
        <Grid item xs={12} sm={12} md={8} lg={6}>
          <Box display={'flex'} flexDirection={'row'}>
            <TextSearch onChange={e => handleChangeSearch(e.target.value)} />
            <Hidden only={'xs'}>
              <Box sx={{ m: 2 }}>
                <Icon path={mdiFilter} size={1} />
              </Box>
            </Hidden>
            <Selection
              ml={2}
              label={'SubjectGroup'}
              height={40}
              width={'75%'}
              firstItemText={'แสดงทั้งหมด'}
              selectionValue={subjectGroupSelection}
              handleChange={e => handleChangeFilter(e.target.value)}
              Items={Object.values(SubjectGroup)?.map(sjg => (
                <MenuItem key={sjg.subject_group_id} value={sjg.subject_group_id}>
                  {sjg.subject_group_name}
                </MenuItem>
              ))}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={4} md={4} lg={2}>
          <Btn handleclick={handleClickOpen} label={'+ Add New'} />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12} sm={12} lg={12} mt={6}>
          {Subjects.length !== 0 || !SubjectLoading || !CurriculumLoading ? (
            <DataGridTable rows={Subjects} columns={columns} uniqueKey={'subject_id'} />
          ) : (
            <Typography>ยังไม่มีรายวิชาในหลักสูตร</Typography>
          )}
        </Grid>
      </Grid>
      <Grid container>
        <AddSubjectModal
          open={open}
          handleClose={handleClose}
          handleSubmit={handleSubmit}
          curriculumId={parseInt(router.query.curriculum_id)}
          subjectGroups={SubjectGroup}
        />
      </Grid>

      <Grid container>
        <EditSubjectModal
          state={editState}
          open={openEdit}
          handleClose={handleCloseEdit}
          handleUpdate={handleUpdate}
          curriculumId={parseInt(router.query.curriculum_id)}
          subjectGroups={SubjectGroup}
          openConfirmDelete={handleOpenConfirmDelete}
        />
      </Grid>

      <Grid container>
        <ConfirmModal
          title={`DELETE Subject`}
          text={`Are you sure you want to delete ${editState.subject_code + ' ' + editState.subject_name_th}?`}
          displayIcon={mdiAlertRhombus}
          submitLabel={'DELETE'}
          open={openConfirmDelete}
          handleClose={handleCloseConfirmDelete}
          handleSubmit={handleDelete}
        />
      </Grid>
      <Grid container>
        <AddSubjectCompetency
          subject={subjectSelection}
          subjects={SubjectsTemp}
          open={openCompetency}
          setSubjects={setSubjectsTemp}
          handleClose={() => {
            setOpenCompetency(false)
          }}

          // handleSubmit={handleDelete}
        />
      </Grid>
      <Grid container>
        <AddContinueSubjects
          open={openContinueSubject}
          handleClose={() => setOpenContinueSubject(false)}
          subject={subjectSelection}
        />
      </Grid>
    </Box>
  )
}

export default Subjects
