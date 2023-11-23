import React, { useEffect, useState } from 'react'
import {
  Typography,
  Grid,
  Box,
  Autocomplete,
  MenuItem,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Card
} from '@mui/material'
import axios from 'axios'
import { mdiPen, mdiTrashCan } from '@mdi/js'
import Icon from '@mdi/react'
import { useFetch } from 'src/hooks'
import { url } from 'src/configs/urlConfig'
import { Btn, DataGridTable, Selection } from 'src/components'

function subjectstructures() {
  const URL_GET_CURRICULUM = `${url.BASE_URL}/curriculums/`
  const URL_GET_SUBJECT_STRUCTURES = `${url.BASE_URL}/subject-structures/`
  const URL_GET_CATEGORIES = `${url.BASE_URL}/subject-categories/`
  const URL_GET_TYPES = `${url.BASE_URL}/subject-types/`
  const URL_GET_GROUPS = `${url.BASE_URL}/subject-groups/`
  const URL_GET_SUBJECTS_BY_CURRICURUM = `${url.BASE_URL}/subjects-by-curriculum/`

  const [curriculumSelected, setCurriculumSelected] = useState(0)
  const [categorySelected, setCategorySelected] = useState(0)
  const [typeSelected, setTypeSelected] = useState(0)
  const [groupSelected, setGroupSelected] = useState(0)
  const [subject, setSubject] = useState([])
  const [open, setOpen] = useState(false)
  // 0 -> insert , 1 -> edit
  const [formType, setFormType] = useState(0)
  const initialState = {
    subject_category_id: '',
    subject_type_id: '',
    subject_group_id: '',
    subject_id: ''
  }
  const [state, setState] = useState(initialState)
  const [subjectStructureId, setSubjectStructureId] = useState(0)

  const {
    error: CurriculumError,
    data: Curriculums,
    setData: setCurriculums,
    loading: CurriculumLoading,
    reFetch: reFetchCurriculums
  } = useFetch(URL_GET_CURRICULUM)

  const {
    error: SubjectsError,
    data: Subjects,
    setData: setSubjects,
    loading: SubjectsLoading,
    reFetch: reFetchSubjects
  } = useFetch(URL_GET_SUBJECTS_BY_CURRICURUM + curriculumSelected)

  const {
    error: CategoriesError,
    data: Categories,
    setData: setCategories,
    loading: CategoriesLoading,
    reFetch: reFetchCategories
  } = useFetch(URL_GET_CATEGORIES)
  const {
    error: TypesError,
    data: Types,
    setData: setTypes,
    loading: TypesLoading,
    reFetch: reFetchTypes
  } = useFetch(URL_GET_TYPES)
  const {
    error: GroupsError,
    data: Groups,
    setData: setGroups,
    loading: GroupsLoading,
    reFetch: reFetchGroups
  } = useFetch(URL_GET_GROUPS)

  const {
    error: SubjectStructuresError,
    data: SubjectStructures,
    setData: setSubjectStructures,
    loading: SubjectStructuresLoading,
    reFetch: reFetchSubjectStructures
  } = useFetch(URL_GET_SUBJECT_STRUCTURES + curriculumSelected)

  const handleOpenForm = (type, structureId, subject, sjCategory, sjType, sjGroup) => {
    if (type === 0) {
      // insert
      setFormType(0)
      setOpen(true)
      setSubject(null)
      setCategorySelected(null)
      setGroupSelected(null)
      setTypeSelected(null)
    } else {
      // edit
      if (subject) {
        setState({
          subject_category_id: sjCategory?.subject_category_id,
          subject_type_id: sjType?.subject_type_id,
          subject_group_id: sjGroup?.subject_group_id,
          subject_id: subject?.subject_id
        })
        setFormType(1)
        setOpen(true)
        setSubject(subject)
        setCategorySelected(sjCategory)
        setTypeSelected(sjType)
        setGroupSelected(sjGroup)
      }
      if (structureId) setSubjectStructureId(structureId)
    }
  }

  const handleSubmit = () => {
    if (state.subject_id !== '' && state.subject_category_id !== '') {
      axios
        .get(URL_GET_SUBJECT_STRUCTURES + curriculumSelected)
        .then(res => {
          if (res.data) {
            const duplicate = Object.values(res.data.data)?.find(d => d.subject.subject_id === state.subject_id)
            if (duplicate) {
              alert('this subject is already exist in curriculum!')
            } else {
              axios
                .post(URL_GET_SUBJECT_STRUCTURES, state)
                .then(res => {
                  if (res.data) {
                    setState(initialState)
                    setOpen(false)
                    reFetchSubjectStructures()
                  }
                })
                .catch(err => console.log('error from insert new subject structure: ', err))
            }
          }
        })
        .catch(err => console.log('error from check duplicate:', err))
    } else {
      alert('Please Select Subject and Category')
    }
  }
  const handleUpdate = () => {
    if (state.subject_id !== '' && state.subject_category_id !== '') {
      axios
        .put(URL_GET_SUBJECT_STRUCTURES + subjectStructureId, state)
        .then(res => {
          if (res.data) {
            setState(initialState)
            setOpen(false)
            reFetchSubjectStructures()
          }
        })
        .catch(err => console.log('error from update subject structure: ', err))
    } else {
      alert('Please Select Subject and Category')
    }
  }
  const handleDelete = id => {
    let result = window.confirm('Confirm to Delete?')
    if (result) {
      axios
        .delete(URL_GET_SUBJECT_STRUCTURES + id)
        .then(res => {
          if (res.data) {
            setState(initialState)
            setOpen(false)
            reFetchSubjectStructures()
            console.log(res.data)
          }
        })
        .catch(err => console.log('error from delete subject structure', err))
    }
  }

  useEffect(() => {
    if (Curriculums.length > 0) {
      const findMaxId = Curriculums?.reduce(
        (max, current) => (current.curriculum_id > max.curriculum_id ? current : max),
        Curriculums[0]
      )
      // console.log(findMaxId)
      setCurriculumSelected(findMaxId.curriculum_id)
    }
  }, [Curriculums])

  useEffect(() => {
    if (state) {
      console.log(state)
    }
  }, [state])

  // console.log(Categories)

  const columns = [
    {
      field: 'subject_code',
      headerName: 'Code',
      width: 100,
      valueGetter: params => params.row?.subject?.subject_code
    },
    {
      field: 'subject_name',
      headerName: 'Subject Name',
      width: 250,
      valueGetter: params => params.row?.subject?.subject_name_th
    },
    {
      field: 'subject_category',
      headerName: 'Category',
      width: 220,
      valueGetter: params => params.row?.subjectCategory?.subject_category_name
    },
    {
      field: 'subject_type',
      headerName: 'Type',
      width: 220,
      valueGetter: params => (params.row?.subjectType ? params.row?.subjectType?.subject_type_name : '-')
    },
    {
      field: 'subject_group',
      headerName: 'Group',
      width: 220,
      valueGetter: params => (params.row?.subjectGroup ? params.row?.subjectGroup?.subject_group_name : '-')
    },

    {
      field: 'E/D',
      width: 300,
      renderCell: params => (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button
              size='small'
              color='secondary'
              variant='outlined'
              onClick={() =>
                handleOpenForm(
                  1,
                  params?.row?.subject_structure_id,
                  params?.row?.subject,
                  params.row?.subjectCategory,
                  params.row?.subjectType,
                  params.row?.subjectGroup
                )
              }
            >
              <Icon path={mdiPen} size={1} />
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              size='small'
              color='error'
              variant='outlined'
              onClick={() => handleDelete(params?.row?.subject_structure_id)}
            >
              <Icon path={mdiTrashCan} size={1} />
            </Button>
          </Grid>
        </Grid>
      )
    }
  ]

  return (
    <>
      <Typography variant='h6'>Subject Structure (Beta)</Typography>
      <Grid container spacing={6} sx={{ mt: 5 }}>
        <Grid item xs={12} md={8} lg={8}>
          <Box display={'flex'} flexDirection={'row'}>
            <Selection
              label={'Curriculum'}
              height={40}
              width={'100%'}
              selectionValue={curriculumSelected}
              handleChange={e => setCurriculumSelected(e.target.value)}
              Items={Object.values(Curriculums)
                ?.sort((a, b) => b.curriculum_id - a.curriculum_id)
                .map(curri => (
                  <MenuItem key={curri.curriculum_id} value={curri.curriculum_id}>
                    {curri.curriculum_name_th + ' ' + curri.curriculum_year}
                  </MenuItem>
                ))}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={4} lg={3.5}>
          <Btn width={'100%'} handleclick={() => handleOpenForm(0)} label={'+ Add New'} />
        </Grid>
        <Grid item xs={12}>
          <DataGridTable
            rowHeight={80}
            rows={Object.values(SubjectStructures).sort((a, b) => a.subject_structure_id - b.subject_structure_id)}
            columns={columns}
            uniqueKey={'subject_structure_id'}
            isLoading={CurriculumLoading === null ? true : CurriculumLoading}
          />
        </Grid>
        {/* form dialog */}
        <Dialog
          open={open}
          onClose={() => {
            setState(initialState)
            setOpen(false)
          }}
          fullWidth
          maxWidth={'md'}
        >
          <DialogTitle>Form Subject Structures</DialogTitle>
          <DialogContent sx={{ minHeight: 450 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{ my: 2 }}>
                {formType === 0 ? (
                  <Autocomplete
                    size='small'
                    disablePortal
                    fullWidth
                    freeSolo
                    options={Subjects || []}
                    getOptionLabel={option => option?.subject_code + ' ' + option?.subject_name_th || ''}
                    renderInput={params => <TextField {...params} label='Subject' />}
                    onChange={(e, value) => {
                      if (value !== null) {
                        setSubject(value)
                        setState(pre => ({ ...pre, subject_id: value.subject_id }))
                      } else {
                        setSubject([])
                        setState(pre => ({ ...pre, subject_id: '' }))
                      }
                    }}
                  />
                ) : (
                  <Autocomplete
                    disabled={true}
                    size='small'
                    disablePortal
                    fullWidth
                    freeSolo
                    value={subject}
                    options={Subjects || []}
                    getOptionLabel={option => option?.subject_code + ' ' + option?.subject_name_th || ''}
                    renderInput={params => <TextField {...params} label='Subject' />}
                  />
                )}
              </Grid>
              <Grid item xs={12} sx={{ my: 2 }}>
                <Autocomplete
                  value={categorySelected}
                  size='small'
                  disablePortal
                  fullWidth
                  freeSolo
                  options={Categories || []}
                  getOptionLabel={option => option?.subject_category_name || ''}
                  renderInput={params => <TextField {...params} label='Subject Category' />}
                  onChange={(e, value) => {
                    if (value !== null) {
                      setCategorySelected(value)
                      setState(pre => ({ ...pre, subject_category_id: value.subject_category_id }))
                    } else {
                      setCategorySelected([])
                      setState(pre => ({ ...pre, subject_category_id: '' }))
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sx={{ my: 2 }}>
                <Autocomplete
                  value={typeSelected}
                  size='small'
                  disablePortal
                  fullWidth
                  freeSolo
                  // options={Jobs?.filter(sj => sj.subject_id !== subject.subject_id)}
                  options={Types || []}
                  getOptionLabel={option => option?.subject_type_name || ''}
                  renderInput={params => <TextField {...params} label='Subject Type' />}
                  onChange={(e, value) => {
                    if (value !== null) {
                      setTypeSelected(value)
                      setState(pre => ({ ...pre, subject_type_id: value.subject_type_id }))
                    } else {
                      setTypeSelected([])
                      setState(pre => ({ ...pre, subject_type_id: '' }))
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sx={{ my: 2 }}>
                <Autocomplete
                  value={groupSelected}
                  size='small'
                  disablePortal
                  fullWidth
                  freeSolo
                  options={
                    // only uniqe subject group name
                    Groups.filter((obj, index, arr) => {
                      const firstIndex = arr.findIndex(item => item.subject_group_name === obj.subject_group_name)
                      return index === firstIndex
                    }) || []
                  }
                  getOptionLabel={option => option?.subject_group_name || ''}
                  renderInput={params => <TextField {...params} label='Subject Group' />}
                  onChange={(e, value) => {
                    if (value !== null) {
                      setGroupSelected(value)
                      setState(pre => ({ ...pre, subject_group_id: value.subject_group_id }))
                    } else {
                      setGroupSelected([])
                      setState(pre => ({ ...pre, subject_group_id: '' }))
                    }
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                formType === 0 ? handleSubmit() : handleUpdate()
              }}
              variant='contained'
            >
              {formType === 0 ? 'Submit' : 'Update'}
            </Button>
            <Button
              onClick={() => {
                setState(initialState)
                setOpen(false)
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </>
  )
}

export default subjectstructures
