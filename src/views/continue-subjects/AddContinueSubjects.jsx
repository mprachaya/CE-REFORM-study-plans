import {
  Dialog,
  Typography,
  DialogContent,
  Grid,
  TextField,
  DialogActions,
  Box,
  Button,
  InputAdornment,
  List,
  ListItem,
  DialogTitle,
  DialogContentText,
  Autocomplete
} from '@mui/material'
import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { CircleLoading, DataGridTable } from 'src/components'
import SnackbarStyled from 'src/components/SnackbarStyled'
import { url } from 'src/configs/urlConfig'
import { useFetch } from 'src/hooks'
// import Selection from 'src/components/Selection'
// import { handleChangeEN, handleChangeNumber, handleChangeTH } from 'src/hooks/useValidation'

function AddContinueSubjects({ open, handleClose, subject, subjects, setSubjects }) {
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackMassage, setSnackMassage] = useState('')
  const parent = [
    { subject_id: 1, subject_code: 'CS101', subject_name_th: 'Introduction to Computer Science', subject_credit: 3 }
  ]
  const childrens = [
    { subject_id: 2, subject_code: 'ENG201', subject_name_th: 'English Composition', subject_credit: 4 },
    { subject_id: 3, subject_code: 'MATH301', subject_name_th: 'Calculus I', subject_credit: 4 }
    // Add more subjects as needed
  ]
  const columnsParent = [
    { field: 'subject_code', headerName: 'Code', flex: 0.3 },
    { field: 'subject_name_th', headerName: 'Subject', flex: 1.2 }
    // { field: 'subject_name_en', headerName: 'Name EN', width: 230 },
  ]
  const columnsChildren = [
    { field: 'subject_code', headerName: 'Code', flex: 0.3 },
    { field: 'subject_name_th', headerName: 'Subject', flex: 0.9 },
    // { field: 'subject_name_en', headerName: 'Name EN', width: 230 },

    {
      field: 'fn',
      headerName: '',
      flex: 0.3,
      renderCell: params => (
        <Grid container spacing={2} justifyContent={'center'}>
          <Grid item>
            <Button
              color='secondary'
              variant='outlined'
              // onClick={() => {
              //   handleDeletePlanRecord(params.row)
              // }}
            >
              Remove
            </Button>
          </Grid>
        </Grid>
      )
    }
  ]

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={'xl'} fullWidth>
      <DialogContent sx={{ minHeight: 450 }}>
        {/* {CompetenciesLoading ? (
          <Box sx={{ width: '100%', height: '100%', mt: 12 }}>
            <CircleLoading />
          </Box>
        ) : ( */}
        <React.Fragment>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography sx={{ mb: 2 }}>รายวิชาก่อนหน้า</Typography>
                {/* <Box sx={{ minHeight: 240, width: '100%', bgcolor: 'gray' }} /> */}
                <DataGridTable
                  rows={parent}
                  columns={columnsParent}
                  uniqueKey={'subject_id'}
                  // isLoading={PlanRecordLoading === null ? true : PlanRecordLoading}
                  // noData='ยังไม่มีรายการแผนการเรียน'
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mt: 6 }}>
              <Grid item xs={12}>
                <Typography sx={{ mb: 2 }}>รายวิชาตัวต่อ</Typography>
                {/* <Box sx={{ minHeight: 240, width: '100%', bgcolor: 'gray' }} /> */}
                <DataGridTable
                  rows={childrens}
                  columns={columnsChildren}
                  uniqueKey={'subject_id'}
                  // isLoading={PlanRecordLoading === null ? true : PlanRecordLoading}
                  // noData='ยังไม่มีรายการแผนการเรียน'
                />
              </Grid>

              <Grid item xs={10}>
                <Autocomplete
                  // key={clearAutoComplete} // if toggle will clear value of autocomplete
                  disablePortal
                  fullWidth
                  options={childrens}
                  getOptionLabel={option => option.subject_code + ' ' + option.subject_name_th}
                  renderInput={params => <TextField {...params} label='Code, Subject name ' />}
                  // onChange={(e, value) => {
                  //   if (value?.subject_id !== undefined) {
                  //     setState(pre => ({
                  //       ...pre,
                  //       study_plan_record_elective_course: null,
                  //       subject_id: value?.subject_id
                  //     }))
                  //   } else {
                  //     setState(pre => ({
                  //       ...pre,
                  //       study_plan_record_elective_course: null,
                  //       subject_id: null
                  //     }))
                  //   }
                  //   // setSubjectSelected(e.target.value)
                  // }}

                  // onChange={e => handleChangeEN(e, setState)}
                  // value={state.curriculum_name_en}
                />
              </Grid>
              <Grid item xs={2}>
                <Button variant='contained' sx={{ height: '100%', width: '100%' }}>
                  เพิ่มวิชาตัวต่อ
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
        </React.Fragment>
        {/* )} */}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color='secondary'>
          Cancel
        </Button>
        {/* <Button onClick={() => !checkIsEmpty(state) && handleSubmit(state)}>Submit</Button> */}
        {/* <Button onClick={() => !checkIsEmpty(state) && handleSubmit(state)}>Submit</Button> */}
      </DialogActions>
      {/* <SnackbarStyled open={openSnackbar} handleClose={() => setOpenSnackbar(false)} massage={snackMassage} /> */}
      {/* <Dialog open={openDescription} onClose={() => setOpenDescription(false)} fullWidth maxWidth='md'>
        <DialogTitle id='alert-dialog-title'>{'Description'}</DialogTitle> */}
      {/* <DialogContent> */}
      {/* <DialogContentText>test</DialogContentText> */}
      {/* <TextField
            multiline
            rows={4}
            fullWidth
            value={subRow.competency_sub_description || ''}
            onChange={e => setSubRow(pre => ({ ...pre, competency_sub_description: e.target.value }))}
          /> */}
      {/* </DialogContent> */}
      {/* <DialogActions>
          <Button
            onClick={() => {
              // setOpenDescription(false)
              // setSnackMassage('test')
              // setOpenSnackbar(true)
              subRow.competency_sub_description !== '' && updateSubDesc()
            }}
          >
            Update
          </Button>
          <Button onClick={() => setOpenDescription(false)} autoFocus>
            Close
          </Button>
        </DialogActions> */}
      {/* </Dialog> */}
    </Dialog>
  )
}

export default AddContinueSubjects
