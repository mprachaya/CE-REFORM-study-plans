import React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

////////////////////Icon/////////////////////////
import Icon from '@mdi/react'
import { mdiPen } from '@mdi/js/'
import { mdiDownload } from '@mdi/js'
import { mdiDotsHorizontal } from '@mdi/js'
import { useMemo, useState } from 'react'
import TextSearch from 'src/components/TextSearch'
import Selection from 'src/components/Selection'
import Btn from 'src/components/Button'
import DataGridTable from 'src/components/DataGridTable'
import AddCurriculumModal from './AddCurriculumModal'
import CurriculumEditModal from './CurriculumEditModal'
import CurriculumDetailsModal from './CurriculumDetailsModal'
import useFetch from 'src/hooks/useFetch'

import CircleLoading from 'src/components/CircleLoading'
import { MenuItem } from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/router'
import useSubmit from 'src/hooks/useSubmit'

const Curriculums = () => {
  const [open, setOpen] = useState(false)
  const [facultySelection, setFacultySelection] = useState(0)

  const URL_GET_CURRICULUM = `https://my-backend-adonis.onrender.com/api/v1/curriculums/`
  const URL_GET_FACULTY = `https://my-backend-adonis.onrender.com/api/v1/faculties`
  const URL_GET_STUDENT_GROUPS = `https://my-backend-adonis.onrender.com/api/v1/collegian-groups`
  const URL_INSERT = `https://my-backend-adonis.onrender.com/api/v1/curriculums/`

  const initialsState = {
    faculty_id: 0,
    collegian_group_id: 0,
    curriculum_name_th: '',
    curriculum_name_en: '',
    curriculum_short_name_th: '',
    curriculum_short_name_en: '',
    curriculum_year: '',
    ref_curriculum_id: ''
  }

  const [state, setState] = useState({
    faculty_id: 5,
    collegian_group_id: 1,
    curriculum_name_th: 'test3',
    curriculum_name_en: 'test3',
    curriculum_short_name_th: 'test3',
    curriculum_short_name_en: 'test3',
    curriculum_year: 2699,
    ref_curriculum_id: ''
  })

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const [openEdit, setOpenEdit] = useState(false)

  const handleClickOpenEdit = () => {
    setOpenEdit(true)
  }

  const handleCloseEdit = () => {
    setOpenEdit(false)
  }

  const [openDetails, setOpenDetails] = useState(false)

  const handleClickOpenDetails = () => {
    setOpenDetails(true)
  }

  const handleCloseDetails = () => {
    setOpenDetails(false)
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

  const loadingState = CurriculumLoading && FacultyLoading && StudentGroupsLoading
  const errorState = CurriculumError && FacultyError && StudentGroupsError

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
            <Button color='secondary' variant='outlined' onClick={handleClickOpenEdit}>
              <Icon path={mdiPen} size={1} />
            </Button>
          </Grid>
          <Grid item>
            <Button color='secondary' variant='outlined'>
              <Icon path={mdiDownload} size={1} />
            </Button>
          </Grid>
          <Grid item>
            <Button color='secondary' variant='outlined' onClick={handleClickOpenDetails}>
              <Icon path={mdiDotsHorizontal} size={1} />
            </Button>
          </Grid>
        </Grid>
      )
    }
  ]

  const columns_details = [
    { field: 'code', headerName: 'Code', width: 200 },
    { field: 'subject_name_tH', headerName: ' Subject Name TH', width: 280 },
    { field: 'subject_name_eH', headerName: 'Subject Name EH', width: 300 },
    { field: 'credit', headerName: 'Credit', width: 140 },
    { field: 'roup_type', headerName: 'Group Type', width: 160 }
  ]

  const rows_details = [
    {
      id: 10,
      code: 'FUNSC101',
      subject_name_tH: 'ฟิสิกส์ 1 สำหรับวิศวกร',
      subject_name_eH: 'Physics 1 for Engineers',
      credit: '3',
      roup_type: 'วิชาพื้นฐานทางวิทยา...'
    },
    {
      id: 20,
      code: 'FUNSC102',
      subject_name_tH: 'ปฎิบบัติการฟิสิกส์ 1 สำหรับวิศวกร',
      subject_name_eH: 'Physics Laboratory 1 for Engineers',
      credit: '1',
      roup_type: 'วิชาพื่นฐานทางวิทยา...'
    },
    {
      id: 30,
      code: 'FUNSC103',
      subject_name_tH: 'โครงสร้างข้อมูลและขั้นตอนวิธี',
      subject_name_eH: 'Data Structures and Algorithms',
      credit: '3',
      roup_type: 'กลุ่มโครงสร้างพื้นฐาน...'
    },
    {
      id: 40,
      code: 'FUNSC104',
      subject_name_tH: 'การวิเคราะห์และออกแบบระบบ',
      subject_name_eH: 'System Analysis Design',
      credit: '3',
      roup_type: 'กลุ่มเทคโนโลยีและวิธี...'
    },
    {
      id: 50,
      code: 'FUNSC105',
      subject_name_tH: 'สหกิจศึกษาทางวิศวกรรมคอมพิวเตอร์',
      subject_name_eH: 'Co-operative Education in Computer...',
      credit: '6',
      roup_type: 'กลุ่มฝึกวิชาชีพและ...'
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
          handleSubmit={() => handleSubmit(state)}
          faculty={Faculty}
          studentGroups={StudentGroups}
        />
      </Grid>

      <Grid container>
        <CurriculumEditModal
          open={openEdit}
          handleClose={handleCloseEdit}
          handleUpdate={() => console.log('Update!')}
        />
      </Grid>

      <Grid container>
        <CurriculumDetailsModal
          open={openDetails}
          handleClose={handleCloseDetails}
          rows_details={rows_details}
          columns_details={columns_details}
        />
      </Grid>
    </Box>
  )
}

export default Curriculums
