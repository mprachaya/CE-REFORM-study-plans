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
  DialogContentText
} from '@mui/material'
import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { CircleLoading } from 'src/components'
import SnackbarStyled from 'src/components/SnackbarStyled'
import { url } from 'src/configs/urlConfig'
import { useFetch } from 'src/hooks'
// import Selection from 'src/components/Selection'
// import { handleChangeEN, handleChangeNumber, handleChangeTH } from 'src/hooks/useValidation'

function AddSubjectCompetency({ open, handleClose, subject, subjects, setSubjects }) {
  const [competencieName, setCompetencieName] = useState('')
  const [subjectSelection, setsubjectSelection] = useState(subject.subject_id)
  const [delay, setDelay] = useState(false)
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackMassage, setSnackMassage] = useState('')
  const [openDescription, setOpenDescription] = useState(false)

  const URL_GET_MAIN_COMPETENCIES = `${url.BASE_URL}/competencies/`
  const {
    error: MainCompetencyError,
    data: MainCompetency,
    setData: setMainCompetency,
    reFetch: reFetchCom,
    loading: Competencies_Loading
  } = useFetch(URL_GET_MAIN_COMPETENCIES)

  const [MainBySubject, setMainBySubject] = useState([])

  useEffect(() => {
    if (MainCompetency) {
      const filterBySubjectId = MainCompetency?.filter(mainCom => {
        return mainCom.subject_id === subject.subject_id
      })
      // console.log('1')
      setMainBySubject(filterBySubjectId)
    }
  }, [MainCompetency])

  useEffect(() => {
    console.log('MainBySubject', MainBySubject)
  }, [MainBySubject])

  useEffect(() => {
    if (open) {
      console.log('subject', subject)
      reFetchCom()
      setDelay(true)
    } else {
    }
  }, [open])
  useEffect(() => {
    if (delay) {
      setTimeout(() => {
        setDelay(false)
      }, 500)
    }
  }, [delay])
  // console.log(MainCompetency)

  const [subCompetency, setSubCompetency] = useState([
    { competency_id: 1, competency_sub_id: 1, competency_sub_name: 'subtest1' },
    { competency_id: 1, competency_sub_id: 2, competency_sub_name: 'subtest2' }
  ])

  const updateComSubjects = com => {
    let obj = subject
    const removeById = subjects.filter(data => {
      return data.subject_id !== obj.subject_id
    })
    obj.competencies = com
    const mainTemp = [...removeById, obj]
    setSubjects(mainTemp)
  }

  const submitMain = comName => {
    let obj = {
      competency_id: 0,
      competency_name: comName
    }
    axios
      .post(URL_GET_MAIN_COMPETENCIES, { subject_id: subject.subject_id, competency_name: comName })
      .then(res => {
        obj.competency_id = res.data.data.competency_id
        const mainTemp = [...MainBySubject, obj]
        updateComSubjects(mainTemp)
        setSnackMassage('Insert Success!')
      })
      .catch(err => setSnackMassage(err))
      .finally(() => {
        setOpenSnackbar(true)
        const mainTemp = [...MainBySubject, obj]
        setMainBySubject(mainTemp)
        setCompetencieName('')
      })
  }
  const deleteMain = id => {
    let result = window.confirm('Confirm to Delete?')
    if (result) {
      axios
        .delete(URL_GET_MAIN_COMPETENCIES + id)
        .then(res => {
          setSnackMassage('Delete Success!')
          const obj = MainBySubject
          const removeById = obj.filter(data => {
            return data.competency_id !== id
          })
          setMainCompetency(removeById)
          updateComSubjects(removeById)
          // console.log('update delete', removeById)
        })
        .catch(err => setSnackMassage(err))
        .finally(() => {
          setOpenSnackbar(true)

          // setSubjects()
        })
    } else {
    }
  }

  const updateById = (e, id) => {
    const updateValue = { competency_id: id, competency_name: e.target.value }
    const removeById = MainBySubject.filter(data => {
      return data.competency_id !== id
    })

    const updateState = [updateValue, ...removeById]
    const sortState = updateState.sort((a, b) => (a.competency_id > b.competency_id ? 1 : -1))
    setMainBySubject(sortState)
    // console.log(sortState)
  }

  const confirmUpdateMain = (id, value) => {
    if (value !== '') {
      axios
        .put(URL_GET_MAIN_COMPETENCIES + id, { competency_name: value })
        .then(res => setSnackMassage('Update Success'))
        .catch(err => setSnackMassage(err))
        .finally(() => {
          setOpenSnackbar(true)
          // reFetchCom()
        })
    } else {
      alert('Value can not be null')
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={'lg'} fullWidth>
      <DialogContent sx={{ minHeight: 450 }}>
        {delay ? (
          <Box sx={{ m: 12, width: '100%', height: '100%' }}>
            <CircleLoading />
          </Box>
        ) : (
          <React.Fragment>
            <Box sx={{ mt: 5, ml: 5 }}>
              <Typography variant='body2'> Subject Compentency</Typography>
              <Typography variant='h6'> {subject.subject_name_th}</Typography>
            </Box>
            <DialogContent>
              <Grid container spacing={2}>
                <Box sx={{ width: '100%', p: 2, m: 2, border: 1, borderColor: 'lightgray', borderRadius: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography sx={{ mx: 2, mt: 2 }}>เพิ่มสมรถถนะหลัก</Typography>
                    </Grid>
                    <Grid item xs={12} md={8} lg={8}>
                      <TextField
                        fullWidth
                        // name={'competency_name'}
                        label='สมรรถนะหลัก'
                        onChange={e => setCompetencieName(e.target.value)}
                        value={competencieName || ''}
                      />
                    </Grid>
                    <Grid item xs={12} md={4} lg={4}>
                      <Button
                        variant='contained'
                        sx={{ px: 2, width: '100%', height: '100%' }}
                        onClick={() => submitMain(competencieName)}
                      >
                        Submit
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
                <Typography sx={{ p: 2, pb: 1 }} variant='body1'>
                  รายการสมรรถนะหลัก
                </Typography>
                {MainBySubject?.map((mainCom, index) => (
                  <Box
                    key={mainCom.competency_id}
                    sx={{ width: '100%', p: 2, m: 2, border: 1, borderColor: 'lightgray', borderRadius: 2 }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={12} md={8} lg={8}>
                        <TextField
                          fullWidth
                          // name={'competency_name'}
                          InputProps={{
                            startAdornment: <InputAdornment position='start'>{index + 1} .</InputAdornment>
                          }}
                          label='ทักษะ สมรรถนะ'
                          onChange={e => {
                            updateById(e, mainCom.competency_id)
                          }}
                          value={mainCom.competency_name || ''}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={2} lg={2}>
                        <Button
                          variant='outlined'
                          sx={{ px: 2, width: '100%', height: '100%' }}
                          onClick={() => confirmUpdateMain(mainCom.competency_id, mainCom.competency_name)}
                        >
                          Update
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={12} md={2} lg={2}>
                        <Button
                          variant='outlined'
                          sx={{ px: 2, width: '100%', height: '100%', color: 'red', borderColor: 'red' }}
                          onClick={() => deleteMain(mainCom.competency_id)}
                        >
                          Delete
                        </Button>
                      </Grid>
                      <Grid container item xs={12} sm={12} md={12} lg={12} direction={'row'}>
                        <Grid item xs={12}>
                          <Typography sx={{ mx: 2, mt: 2 }}>รายการสมรรถนะย่อย</Typography>
                        </Grid>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <List>
                              {Object.values(subCompetency)
                                .filter(sub => {
                                  return sub.competency_id === mainCom.competency_id
                                })
                                .map(filterSub => (
                                  <ListItem key={filterSub.competency_sub_id}>
                                    {/* <ListItemText primary={'- ' + filterSub.competency_sub_name} /> */}
                                    <Grid container spacing={2}>
                                      <Grid item xs={6}>
                                        <TextField
                                          fullWidth
                                          // name={'curriculum_name_th'}
                                          label='สมรรถนะย่อย'
                                          // onChange={e => handleChangeTH(e, setState)}
                                          value={filterSub.competency_sub_name}
                                        />
                                      </Grid>
                                      <Grid item xs={2}>
                                        <Button
                                          variant='outlined'
                                          sx={{ px: 2, width: '100%', height: '100%' }}
                                          onClick={() => setOpenDescription(true)}
                                        >
                                          Description
                                        </Button>
                                      </Grid>
                                      <Grid item xs={2}>
                                        <Button
                                          variant='outlined'
                                          sx={{ px: 2, width: '100%', height: '100%' }}
                                          // onClick={submitMain}
                                        >
                                          Update
                                        </Button>
                                      </Grid>
                                      <Grid item xs={2}>
                                        <Button
                                          variant='outlined'
                                          sx={{
                                            px: 2,
                                            width: '100%',
                                            height: '100%',
                                            color: 'red',
                                            borderColor: 'red'
                                          }}
                                          // onClick={submitMain}
                                        >
                                          Delete
                                        </Button>
                                      </Grid>
                                    </Grid>
                                  </ListItem>
                                ))}
                            </List>
                          </Grid>
                          <Grid item xs={8}>
                            <TextField
                              fullWidth
                              name={'curriculum_name_th'}
                              label='สมรรถนะย่อย'
                              // onChange={e => handleChangeTH(e, setState)}
                              // value={state.curriculum_name_th}3
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <Button variant='contained' sx={{ height: '100%', width: '100%' }}>
                              Submit
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
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
      <Dialog open={openDescription} onClose={() => setOpenDescription(false)} fullWidth maxWidth='md'>
        <DialogTitle id='alert-dialog-title'>{'Description'}</DialogTitle>
        <DialogContent>
          <DialogContentText>test</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDescription(false)
              setSnackMassage('test')
              setOpenSnackbar(true)
            }}
          >
            Update
          </Button>
          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <SnackbarStyled open={openSnackbar} handleClose={() => setOpenSnackbar(false)} massage={snackMassage} />
    </Dialog>
  )
}

export default AddSubjectCompetency
