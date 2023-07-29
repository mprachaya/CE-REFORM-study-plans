import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

////////////////////Icon/////////////////////////
import Icon from '@mdi/react'
import { mdiPen } from '@mdi/js/'
import { mdiDownload } from '@mdi/js'
import { mdiDotsHorizontal } from '@mdi/js'
import { useState } from 'react'
import TextSearch from 'src/components/TextSearch'
import Selection from 'src/components/Selection'
import Btn from 'src/components/Button'
import DataGridTable from 'src/components/DataGridTable'
import AddCurriculumModal from './AddCurriculumModal'
import CurriculumEditModal from './CurriculumEditModal'
import CurriculumDetailsModal from './CurriculumDetailsModal'

const curriculums = () => {
  const [open, setOpen] = useState(false)

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

  const columns = [
    { field: 'year', headerName: 'Year', width: 100 },
    { field: 'curriculum_th', headerName: 'Curriculum Name TH', width: 210 },
    { field: 'Curriculum_en', headerName: 'Curriculum Name EN', width: 230 },
    {
      field: 'faculty',
      headerName: 'Faculty',
      width: 130
    },
    { field: 'student', headerName: 'Student', width: 100 },

    {
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

  const rows = [
    {
      id: 1,
      year: '2560',
      curriculum_th: 'วศ.บ วิศวกรรมคอมพิวเตอร์',
      Curriculum_en: 'B.Eng (Computer Engineering)',
      faculty: 'Engineering',
      student: 'วศ.บ'
    },
    {
      id: 2,
      year: '2565',
      curriculum_th: 'วศ.บ วิศวกรรมคอมพิวเตอร์',
      Curriculum_en: 'B.Eng (Computer Engineering)',
      faculty: ' Engineering',
      student: 'ค.อ.บ'
    },
    {
      id: 3,
      year: '2566',
      curriculum_th: 'วศ.บ วิศวกรรมคอมพิวเตอร์',
      Curriculum_en: 'B.Eng (Computer Engineering)',
      faculty: 'Engineering',
      student: 'วศ.บ'
    },
    {
      id: 4,
      year: '2555',
      curriculum_th: 'วศ.บ วิศวกรรมคอมพิวเตอร์',
      Curriculum_en: 'B.Eng (Computer Engineering)',
      faculty: 'Engineering',
      student: 'ค.อ.บ'
    },
    {
      id: 5,
      year: '2560',
      curriculum_th: 'วศ.บ วิศวกรรมคอมพิวเตอร์',
      Curriculum_en: 'B.Eng (Computer Engineering)',
      faculty: 'Engineering',
      student: 'ค.อ.บ'
    }
  ]

  const rows_details = [
    {
      id: 1,
      code: 'FUNSC101',
      subject_name_tH: 'ฟิสิกส์ 1 สำหรับวิศวกร',
      subject_name_eH: 'Physics 1 for Engineers',
      credit: '3',
      roup_type: 'วิชาพื้นฐานทางวิทยา...'
    },
    {
      id: 2,
      code: 'FUNSC102',
      subject_name_tH: 'ปฎิบบัติการฟิสิกส์ 1 สำหรับวิศวกร',
      subject_name_eH: 'Physics Laboratory 1 for Engineers',
      credit: '1',
      roup_type: 'วิชาพื่นฐานทางวิทยา...'
    },
    {
      id: 3,
      code: 'FUNSC103',
      subject_name_tH: 'โครงสร้างข้อมูลและขั้นตอนวิธี',
      subject_name_eH: 'Data Structures and Algorithms',
      credit: '3',
      roup_type: 'กลุ่มโครงสร้างพื้นฐาน...'
    },
    {
      id: 4,
      code: 'FUNSC104',
      subject_name_tH: 'การวิเคราะห์และออกแบบระบบ',
      subject_name_eH: 'System Analysis Design',
      credit: '3',
      roup_type: 'กลุ่มเทคโนโลยีและวิธี...'
    },
    {
      id: 5,
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
        <Grid item xs={12} sm={2} lg={2} minWidth={150}>
          <Selection />
        </Grid>
        <Grid item xs={12} sm={2} lg={2}>
          <Btn handleClick={handleClickOpen} />
        </Grid>
      </Grid>
      <Grid item xs={12} sm={12} lg={12} mt={6}>
        <DataGridTable rows={rows} columns={columns} />
      </Grid>

      <Grid container>
        <AddCurriculumModal open={open} handleClose={handleClose} handleSubmit={() => console.log('Submit!')} />
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

export default curriculums
