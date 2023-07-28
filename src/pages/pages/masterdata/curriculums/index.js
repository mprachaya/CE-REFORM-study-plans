import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Magnify from 'mdi-material-ui/Magnify'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Stack from '@mui/material/Stack'

////////////////////Icon/////////////////////////
import Icon from '@mdi/react'
import { mdiSitemapOutline } from '@mdi/js'
import { mdiPen } from '@mdi/js/'
import { mdiDownload } from '@mdi/js'
import { mdiDotsHorizontal } from '@mdi/js'
import { mdiDelete } from '@mdi/js'
import { useState } from 'react'
import TextSearch from 'src/components/TextSearch'

const curriculums = () => {
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const [openedit, setOpenEdit] = useState(false)

  const handleClickOpenEdit = () => {
    setOpenEdit(true)
  }

  const handleCloseEdit = () => {
    setOpenEdit(false)
  }

  const [opendetails, setOpenDetails] = useState(false)

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
            <Button variant='outlined' color='primary' onClick={handleClickOpenEdit}>
              <Icon path={mdiPen} size={1} />
            </Button>
          </Grid>
          <Grid item>
            <Button variant='outlined' color='primary'>
              <Icon path={mdiDownload} size={1} />
            </Button>
          </Grid>
          <Grid item>
            <Button variant='outlined' color='primary' onClick={handleClickOpenDetails}>
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
      <Typography variant='h6'>Curriculums</Typography>
      <Grid container spacing={5} sx={{ mt: 5 }} justifyContent={'start'}>
        <Grid item xs={12} sm={3} lg={3} minWidth={250}>
          <TextSearch />
        </Grid>

        <Grid item xs={12} sm={2} lg={2} minWidth={150}>
          <FormControl>
            <InputLabel sx={{ m: -2 }} id='form-layouts-separator-select-label'>
              Faculty
            </InputLabel>
            <Select
              sx={{ height: 40 }}
              label='Country'
              defaultValue=''
              id='form-layouts-separator-select'
              labelId='form-layouts-separator-select-label'
            >
              <MenuItem value='University 1'>University 1</MenuItem>
              <MenuItem value='University 2'>University 2</MenuItem>
              <MenuItem value='University 3'>University 3</MenuItem>
              <MenuItem value='University 4'>University 4</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2} lg={2}>
          <Button
            sx={{
              bgcolor: 'primary.main',
              color: 'grey.50',
              '&:hover': {
                bgcolor: 'white',
                color: 'primary.main'
              }
            }}
            onClick={handleClickOpen}
          >
            Add New
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={12} lg={12} mt={6}>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            sx={{}}
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 20 }
              }
            }}
            pageSizeOptions={[20, 50, 100]}
            disableRowSelectionOnClick
          />
        </div>
      </Grid>

      <Grid container>
        <Dialog open={open} onClose={handleClose} maxWidth={'lg'} fullWidth>
          <Typography variant='h6' sx={{ mt: 5, ml: 5 }}>
            Add new curriculum
          </Typography>
          <DialogContent sx={{ display: 'flex' }}>
            <Grid item sm={12} md={12} lg={6}>
              <TextField fullWidth label='Curriculum Name TH *' placeholder='Thai Only' />
            </Grid>
            <Grid item sm={12} md={12} lg={6}>
              <TextField fullWidth label='Curriculum Name EN *' placeholder='English Only' />
            </Grid>
          </DialogContent>
          <DialogContent sx={{ display: 'flex' }}>
            <Grid item sm={12} md={12} lg={3}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>Faculty *</InputLabel>
                <Select
                  label='Category'
                  defaultValue=''
                  id='form-layouts-separator-select'
                  labelId='form-layouts-separator-select-label'
                >
                  <MenuItem value='University 1'>* </MenuItem>
                  <MenuItem value='University 2'>** </MenuItem>
                  <MenuItem value='University 3'>*** </MenuItem>
                  <MenuItem value='University 4'>**** </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item sm={12} md={12} lg={3}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>Student Group *</InputLabel>
                <Select
                  label='Category'
                  defaultValue=''
                  id='form-layouts-separator-select'
                  labelId='form-layouts-separator-select-label'
                >
                  <MenuItem value='University 1'>* </MenuItem>
                  <MenuItem value='University 2'>** </MenuItem>
                  <MenuItem value='University 3'>*** </MenuItem>
                  <MenuItem value='University 4'>**** </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item sm={12} md={12} lg={3} sx={{ mt: 2, ml: 2 }}>
              <FormGroup>
                <FormControlLabel control={<Checkbox defaultChecked />} label='Dupliacte Subjects' />
              </FormGroup>
            </Grid>
            <Grid item sm={12} md={12} lg={3}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>Subject from *</InputLabel>
                <Select
                  label='Category'
                  defaultValue=''
                  id='form-layouts-separator-select'
                  labelId='form-layouts-separator-select-label'
                >
                  <MenuItem value='University 1'>* </MenuItem>
                  <MenuItem value='University 2'>** </MenuItem>
                  <MenuItem value='University 3'>*** </MenuItem>
                  <MenuItem value='University 4'>**** </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </DialogContent>
          <DialogContent sx={{ display: 'flex' }}>
            <Grid item sm={12} md={12} lg={6}>
              <TextField fullWidth label='Year *' placeholder='Number Only ' />
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleClose}>Submit</Button>
          </DialogActions>
        </Dialog>
      </Grid>

      <Grid container>
        <Dialog open={openedit} onClose={handleCloseEdit} maxWidth={'lg'} fullWidth>
          <Grid item sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Grid>
              <Typography variant='h6' sx={{ mt: 5, ml: 5 }}>
                Curriculum edit
              </Typography>
            </Grid>
            <Grid>
              <Stack direction='row' spacing={2} sx={{ mt: 5, mr: 5 }}>
                <Button variant='outlined' startIcon={<Icon path={mdiSitemapOutline} size={1} />}>
                  Curriculum Stucture
                </Button>
                <Button variant='outlined' startIcon={<Icon path={mdiPen} size={1} />}>
                  Subjec Managment
                </Button>
                <Button variant='outlined' startIcon={<Icon bgcolor='red' path={mdiDelete} size={1} />}>
                  Delete
                </Button>
              </Stack>
            </Grid>
          </Grid>

          <DialogContent sx={{ display: 'flex' }}>
            <Grid item sm={12} md={12} lg={6}>
              <TextField fullWidth label='Curriculum Name TH *' placeholder='Thai Only and Number' />
            </Grid>
            <Grid item sm={12} md={12} lg={6}>
              <TextField fullWidth label='Curriculum Name EN *' placeholder='English Only and Number' />
            </Grid>
          </DialogContent>
          <DialogContent sx={{ display: 'flex' }}>
            <Grid item sm={12} md={12} lg={3}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>Faculty *</InputLabel>
                <Select
                  label='Category'
                  defaultValue=''
                  id='form-layouts-separator-select'
                  labelId='form-layouts-separator-select-label'
                >
                  <MenuItem value='University 1'>* </MenuItem>
                  <MenuItem value='University 2'>** </MenuItem>
                  <MenuItem value='University 3'>*** </MenuItem>
                  <MenuItem value='University 4'>**** </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item sm={12} md={12} lg={3}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>Student Group *</InputLabel>
                <Select
                  label='Category'
                  defaultValue=''
                  id='form-layouts-separator-select'
                  labelId='form-layouts-separator-select-label'
                >
                  <MenuItem value='University 1'>* </MenuItem>
                  <MenuItem value='University 2'>** </MenuItem>
                  <MenuItem value='University 3'>*** </MenuItem>
                  <MenuItem value='University 4'>**** </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </DialogContent>
          <DialogContent sx={{ display: 'flex' }}>
            <Grid item sm={12} md={12} lg={6}>
              <TextField fullWidth label='Year *' placeholder='Number Only ' />
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleClose}>Submit</Button>
          </DialogActions>
        </Dialog>
      </Grid>

      <Grid container>
        <Dialog open={opendetails} onClose={handleCloseDetails} maxWidth={'lg'} fullWidth>
          <Grid item sx={{ mt: 10, ml: 10 }}>
            <Typography variant='h6'>Curriculums Details</Typography>
          </Grid>
          <Grid sx={{ display: 'flex' }}>
            <Grid sx={{ mt: 5, mb: 5, ml: 10 }}>
              <Typography>Curriculum Name TH :</Typography>
              <Typography>Faculty :</Typography>
              <Typography>Student Group :</Typography>
            </Grid>
            <Grid sx={{ mt: 5, mb: 5, ml: 55 }}>
              <Typography>Curriculum Name EH :</Typography>
              <Typography>
                <p></p>
              </Typography>
              <Typography>Year :</Typography>
            </Grid>
            <Grid sx={{ mt: 5, mb: 5, ml: 70, mr: 10 }}>
              <Typography>
                <p></p>
              </Typography>
              <Typography>
                <p></p>
              </Typography>
              <TextField
                size='small'
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Magnify fontSize='small' />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
          </Grid>

          <Grid item sx={{ ml: 10, mr: 10, display: 'flex', justifyContent: 'space-between' }}>
            <Grid item xs={12} sm={12} lg={12}>
              <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                  sx={{}}
                  rows={rows_details}
                  columns={columns_details}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 5 }
                    }
                  }}
                  pageSizeOptions={[5, 10]}
                  disableRowSelectionOnClick
                />
                <Typography>Total Subject</Typography>
              </div>
            </Grid>
          </Grid>
          <DialogActions sx={{ mt: 20 }}>
            <Button onClick={handleCloseDetails}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </Box>
  )
}

export default curriculums
