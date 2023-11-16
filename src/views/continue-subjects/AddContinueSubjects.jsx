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

function AddContinueSubjects({ open, handleClose, subject }) {
  const URL_GET_CONTINUE_SUBJECT_BY_SUBJECT_ID = `${url.BASE_URL}/continue-subjects-subject-id/`
  const URL_GET_SUBJECTS = `${url.BASE_URL}/subjects-by-curriculum/`
  const URL_ADD_CONTINUE_SUBJECT = `${url.BASE_URL}/continue-subjects/`

  const {
    error: ContinueSubjectsError,
    data: ContinueSubjects,
    setData: setContinueSubjects,
    loading: ContinueSubjectsLoading,
    reFetch: reFetchContinueSubjects
  } = useFetch(URL_GET_CONTINUE_SUBJECT_BY_SUBJECT_ID + subject?.subject_id)

  const {
    error: SubjectError,
    data: Subjects,
    setData: setSubjects,
    loading: SubjectLoading,
    reFetch: reFetchSubjects
  } = useFetch(URL_GET_SUBJECTS + subject?.curriculum_id)

  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackMassage, setSnackMassage] = useState('')

  const [subjectSelected, setSubjectSelected] = useState(null)

  const columnsParent = [
    {
      field: 'subject_code',
      headerName: 'Code',
      valueGetter: params => params.row?.subjects?.subject_code,
      flex: 0.3
    },
    {
      field: 'subject_name_th',
      headerName: 'Subject',
      valueGetter: params => params.row?.subjects?.subject_name_th,
      flex: 1.2
    }
    // { field: 'subject_name_en', headerName: 'Name EN', width: 230 },
  ]
  const columnsChildren = [
    {
      field: 'subject_code',
      headerName: 'Code',
      valueGetter: params => params.row?.subjects?.subject_code,
      flex: 0.3
    },
    {
      field: 'subject_name_th',
      headerName: 'Subject',
      valueGetter: params => params.row?.subjects?.subject_name_th,
      flex: 1
    },
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
              sx={{ width: 180 }}
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
  const [isDone, setIsDone] = useState(null)

  const checkSubject = (subjectId, addChildren) => {
    if (subjectId)
      axios
        .get(URL_GET_CONTINUE_SUBJECT_BY_SUBJECT_ID + subjectId)
        .then(res => {
          if (res.data.data.length > 0) {
            alert('this subject has parent already or this subject is root node')
          } else {
            // console.log('add children')
            addChildren()
          }
        })
        .catch(err => console.log(err))
  }

  const addNewChildren = childrenId => {
    // check parent is exist
    setIsDone(false)
    if (subject?.subject_id) {
      axios
        .get(URL_GET_CONTINUE_SUBJECT_BY_SUBJECT_ID + subject?.subject_id)
        .then(res => {
          if (res.data.data.length > 0) {
            //if parent exist insert children
            childrenId &&
              axios
                .post(URL_ADD_CONTINUE_SUBJECT, { parent_id: subject?.subject_id, subject_id: childrenId })
                .then(res => {
                  if (res.data.status === 201) {
                    // alert('insert children ' + res.data.data.subject_id)
                    console.log('insert children ' + res.data.data.subject_id)
                    setIsDone(true)
                  }
                })
                .catch(err => console.log(err))
          } else {
            //if not insert parent then insert children
            axios
              .post(URL_ADD_CONTINUE_SUBJECT, { parent_id: '', subject_id: subject?.subject_id })
              .then(res => {
                if (res.data.status === 201) {
                  // alert('create root node ' + res.data.data.subject_id)
                  console.log('create root node ' + res.data.data.subject_id)
                }
              })
              .catch(err => console.log(err))
            childrenId &&
              axios
                .post(URL_ADD_CONTINUE_SUBJECT, { parent_id: subject?.subject_id, subject_id: childrenId })
                .then(res => {
                  if (res.data.status === 201) {
                    // alert('insert children ' + res.data.data.subject_id)
                    console.log('insert children ' + res.data.data.subject_id)
                    setIsDone(true)
                  }
                })
                .catch(err => console.log(err))
          }
        })
        .catch(err => console.log(err))
    }
  }

  useEffect(() => {
    ContinueSubjects && console.log(ContinueSubjects)
  }, [ContinueSubjects])

  if (ContinueSubjectsError && SubjectError) {
    return <Box>Error Fetching...</Box>
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={'xl'} fullWidth>
      <DialogContent sx={{ minHeight: 600 }}>
        {ContinueSubjectsLoading ? (
          <Box sx={{ width: '100%', height: '100%', mt: 24 }}>
            <CircleLoading />
          </Box>
        ) : (
          <React.Fragment>
            <DialogContent>
              <Grid container>
                <Grid item xs={12}>
                  <Typography sx={{ mb: 2 }}>{subject?.subject_code + ' ' + subject?.subject_name_th + ' '}</Typography>
                  {/* <Box sx={{ minHeight: 240, width: '100%', bgcolor: 'gray' }} /> */}
                  {ContinueSubjects?.length === 0
                    ? null
                    : ContinueSubjects[0]?.parent_id !== null &&
                      ContinueSubjects[0]?.parent_id !== undefined && (
                        <React.Fragment>
                          <Typography sx={{ mb: 2 }}>รายวิชาก่อนหน้า</Typography>
                          <DataGridTable
                            rows={ContinueSubjects}
                            columns={columnsParent}
                            uniqueKey={'continue_subject_id'}
                            hidePagination={true}
                            // isLoading={PlanRecordLoading === null ? true : PlanRecordLoading}
                            // noData='ยังไม่มีรายการแผนการเรียน'
                          />
                        </React.Fragment>
                      )}
                  {ContinueSubjects[0]?.parent_id === null && (
                    <React.Fragment>
                      <Typography sx={{ color: 'gray' }}>วิชานี้เป็น Root node</Typography>
                    </React.Fragment>
                  )}
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ mt: 6 }}>
                <Grid item xs={12}>
                  {ContinueSubjects[0]?.children !== undefined ? (
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography sx={{ mb: 2 }}>รายวิชาตัวต่อ</Typography>
                        <DataGridTable
                          rows={ContinueSubjects[0]?.children}
                          columns={columnsChildren}
                          uniqueKey={'continue_subject_id'}
                          hidePagination={true}
                          isLoading={ContinueSubjectsLoading === null ? true : ContinueSubjectsLoading}
                          noData='ยังไม่มีรายการแผนการเรียน'
                        />
                      </Grid>

                      {/* <Box sx={{ minHeight: 240, width: '100%', bgcolor: 'gray' }} /> */}

                      <Grid item xs={6} md={10} mt={2}>
                        <Autocomplete
                          // key={clearAutoComplete} // if toggle will clear value of autocomplete
                          disablePortal
                          fullWidth
                          options={Subjects}
                          getOptionLabel={option => option.subject_code + ' ' + option.subject_name_th}
                          renderInput={params => <TextField {...params} label='Code, Subject name ' />}
                          onChange={(e, value) => {
                            setSubjectSelected(value)
                          }}
                        />
                      </Grid>
                      <Grid item xs={6} md={2} mt={2}>
                        <Button
                          disabled={!isDone && isDone !== null ? true : false}
                          variant='contained'
                          sx={{ height: '100%', width: '100%' }}
                          onClick={() =>
                            checkSubject(subjectSelected?.subject_id, () => addNewChildren(subjectSelected?.subject_id))
                          }
                        >
                          เพิ่มวิชาตัวต่อ
                        </Button>
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography sx={{ mb: 2 }}>รายวิชาตัวต่อ</Typography>
                      </Grid>
                      <Grid item xs={6} md={10}>
                        <Autocomplete
                          // key={clearAutoComplete} // if toggle will clear value of autocomplete
                          disablePortal
                          fullWidth
                          options={Subjects}
                          getOptionLabel={option => option.subject_code + ' ' + option.subject_name_th}
                          renderInput={params => <TextField {...params} label='Code, Subject name ' />}
                          onChange={(e, value) => {
                            setSubjectSelected(value)
                          }}
                        />
                      </Grid>
                      <Grid item xs={6} md={2}>
                        <Button
                          disabled={!isDone && isDone !== null ? true : false}
                          variant='contained'
                          sx={{ height: '100%', width: '100%' }}
                          onClick={() =>
                            checkSubject(subjectSelected?.subject_id, () => addNewChildren(subjectSelected?.subject_id))
                          }
                        >
                          เพิ่มวิชาตัวต่อ
                        </Button>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
          </React.Fragment>
        )}
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
