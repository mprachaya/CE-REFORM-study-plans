import React, { useEffect, useState } from 'react'
import {
  Typography,
  Grid,
  Box,
  Autocomplete,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material'
import { mdiPen, mdiTrashCan } from '@mdi/js'
import axios from 'axios'
import Icon from '@mdi/react'
import { url } from 'src/configs/urlConfig'
import { Btn, DataGridTable, Selection } from 'src/components'
import { useFetch } from 'src/hooks'
import { handleChangeNumber } from 'src/hooks/useValidation'

function curriculumstructure() {
  const URL_GET_CURRICULUM = `${url.BASE_URL}/curriculums/`
  const URL_GET_CURRICULUM_STRUCTURES = `${url.BASE_URL}/curriculum-structures-v2/`
  const URL_GET_CATEGORIES = `${url.BASE_URL}/subject-categories/`
  const URL_GET_TYPES = `${url.BASE_URL}/subject-types/`
  const URL_GET_GROUPS = `${url.BASE_URL}/subject-groups/`
  const [curriculumSelected, setCurriculumSelected] = useState(0)

  const [categorySelected, setCategorySelected] = useState(0)
  const [typeSelected, setTypeSelected] = useState(0)
  const [groupSelected, setGroupSelected] = useState(0)
  const [creditTotal, setCreditTotal] = useState(3)
  const [open, setOpen] = useState(false)
  // 0 -> insert , 1 -> edit
  const [formType, setFormType] = useState(0)
  const initialState = {
    curriculum_id: 0,
    subject_category_id: 0,
    subject_type_id: 0,
    subject_group_id: 0,
    csv2_credit_total: 1
  }
  const [state, setState] = useState(initialState)
  const [curriculumStructuresId, setCurriculumStructuresId] = useState(0)

  const {
    error: CurriculumError,
    data: Curriculums,
    setData: setCurriculums,
    loading: CurriculumLoading,
    reFetch: reFetchCurriculums
  } = useFetch(URL_GET_CURRICULUM)
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
    error: CurriculumStructuresError,
    data: CurriculumStructures,
    setData: setCurriculumStructures,
    loading: CurriculumStructuresLoading,
    reFetch: reFetchCurriculumStructures
  } = useFetch(URL_GET_CURRICULUM_STRUCTURES + curriculumSelected)

  const handleOpenForm = (type, structureId, sjCategory, sjType, sjGroup, totalCredit) => {
    if (type === 0) {
      // insert
      setState(pre => ({ ...pre, curriculum_id: curriculumSelected }))
      setFormType(0)
      setOpen(true)
      setCreditTotal(1)
      setCategorySelected(null)
      setGroupSelected(null)
      setTypeSelected(null)
    } else {
      // edit
      if (sjCategory) {
        setState({
          curriculum_id: curriculumSelected,
          subject_category_id: sjCategory?.subject_category_id,
          subject_type_id: sjType?.subject_type_id || null,
          subject_group_id: sjGroup?.subject_group_id || null,
          csv2_credit_total: totalCredit
        })
        setFormType(1)
        setOpen(true)
        setCreditTotal(totalCredit)
        setCategorySelected(sjCategory)
        setTypeSelected(sjType)
        setGroupSelected(sjGroup)
      }
      if (structureId) setCurriculumStructuresId(structureId)
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

  const columns = [
    {
      field: 'credit_total',
      headerName: 'Credit Total',
      width: 180,
      valueGetter: params => params?.row?.csv2_credit_total,
      align: 'center',
      headerAlign: 'center'
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
      width: 250,
      align: 'right',
      headerAlign: 'right',
      renderCell: params => (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
              <Button
                size='small'
                color='secondary'
                variant='outlined'
                onClick={() =>
                  handleOpenForm(
                    1,
                    params?.row?.curriculum_structures_v2_id,
                    params.row?.subjectCategory,
                    params.row?.subjectType,
                    params.row?.subjectGroup,
                    params.row?.csv2_credit_total
                  )
                }
              >
                <Icon path={mdiPen} size={1} />
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
              <Button
                size='small'
                color='error'
                variant='outlined'
                onClick={() => handleDelete(params?.row?.subject_structure_id)}
              >
                <Icon path={mdiTrashCan} size={1} />
              </Button>
            </Box>
          </Grid>
        </Grid>
      )
    }
  ]

  return (
    <>
      <Typography variant='h6'>Curriculums Structure</Typography>
      <Grid container spacing={6} sx={{ mt: 5 }}>
        <Grid item xs={12} md={8}>
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
        </Grid>
        <Grid item xs={12} md={4} lg={2.5}>
          <Btn width={'100%'} handleclick={() => handleOpenForm(0)} label={'+ Add New'} />
        </Grid>
        <Grid item xs={12}>
          {CurriculumStructures.length > 0 ? (
            <DataGridTable
              rowHeight={80}
              rows={Object.values(CurriculumStructures).sort((a, b) => a.subject_structure_id - b.subject_structure_id)}
              columns={columns}
              uniqueKey={'curriculum_structures_v2_id'}
              isLoading={CurriculumStructuresLoading === null ? true : CurriculumStructuresLoading}
            />
          ) : (
            <Typography sx={{ m: 6 }}> this curriculum has no structure yet</Typography>
          )}
        </Grid>
      </Grid>
      <Dialog
        open={open}
        onClose={() => {
          setState(initialState)
          setOpen(false)
        }}
        fullWidth
        maxWidth={'md'}
      >
        <DialogTitle>Form Curriculum Structures</DialogTitle>
        <DialogContent sx={{ minHeight: 450 }}>
          <Grid container spacing={2}>
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
                    setState(pre => ({ ...pre, subject_category_id: null }))
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
                    setState(pre => ({ ...pre, subject_type_id: null }))
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
                    setState(pre => ({ ...pre, subject_group_id: null }))
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name='csv2_credit_total'
                type='number'
                value={state?.csv2_credit_total || 1}
                onChange={e => {
                  handleChangeNumber(e, setState)
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
    </>
  )
}

export default curriculumstructure
