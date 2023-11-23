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
  TextField,
  Chip,
  Card
} from '@mui/material'
import { mdiPen, mdiTrashCan } from '@mdi/js'
import Icon from '@mdi/react'
import { useFetch } from 'src/hooks'
import { url } from 'src/configs/urlConfig'
import { Btn, DataGridTable, Selection } from 'src/components'

function subjectstructures() {
  const [curriculumSelected, setCurriculumSelected] = useState(0)

  const URL_GET_CURRICULUM = `${url.BASE_URL}/curriculums/`
  const URL_GET_SUBJECT_STRUCTURES = `${url.BASE_URL}/subject-structures/`
  const URL_GET_CATEGORIES = `${url.BASE_URL}/subject-categories/`

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
    error: SubjectStructuresError,
    data: SubjectStructures,
    setData: setSubjectStructures,
    loading: SubjectStructuresLoading,
    reFetch: reFetchSubjectStructures
  } = useFetch(URL_GET_SUBJECT_STRUCTURES + curriculumSelected)

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

  console.log(Categories)

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
      headerName: '',
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
      field: 'fn',
      headerName: 'Category',
      width: 300,
      renderCell: params => (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button
              size='small'
              color='secondary'
              variant='outlined'
              //  onClick={() => handleClickOpenEdit(params.row)}
            >
              <Icon path={mdiPen} size={1} />
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              size='small'
              color='error'
              variant='outlined'
              // onClick={() => handleClickOpenDetails(params.row)}
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
          <Btn width={'100%'} handleclick={() => void 0} label={'+ Add New'} />
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
      </Grid>
    </>
  )
}

export default subjectstructures
