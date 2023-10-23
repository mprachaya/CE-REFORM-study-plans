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
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { CircleLoading } from 'src/components'
import SnackbarStyled from 'src/components/SnackbarStyled'
import { url } from 'src/configs/urlConfig'
import { useFetch } from 'src/hooks'
// import Selection from 'src/components/Selection'
// import { handleChangeEN, handleChangeNumber, handleChangeTH } from 'src/hooks/useValidation'

function AddSubjectCompetency({ open, handleClose, handleSubmit, subject }) {
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
    // console.log('MainCompetency', MainCompetency)
    if (MainCompetency) {
      const filterBySubjectId = MainCompetency?.filter(mainCom => {
        return mainCom.subject_id === subject.subject_id
      })
      setMainBySubject(filterBySubjectId)
    }
    console.log('test', filterBySubjectId)
  }, [MainCompetency])

  useEffect(() => {
    if (open) {
      console.log('subject', subject)
      reFetchCom()
      setDelay(true)
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

  // const [MainCompetency, setMainCompetency] = useState([
  //   { competency_id: 1, competency_name: 'test1' },
  //   { competency_id: 2, competency_name: 'test2' }
  // ])

  // const [subCompetency, setSubCompetency] = useState([])
  const submitMain = comName => {
    const obj = {
      competency_id: Date.now(),
      competency_name: comName
    }
    const mainTemp = [...MainCompetency, obj]
    setMainCompetency(mainTemp)
    setCompetencieName('')
  }
  const deleteMain = id => {
    // const obj = {
    //   competency_id: parseInt(MainCompetency.length) + 1,
    //   competency_name: 'test' + (parseInt(MainCompetency.length) + 1)
    // }
    const obj = MainCompetency
    const removeById = obj.filter(data => {
      return data.competency_id !== id
    })
    // console.log(removeById)
    // const mainTemp = [...MainCompetency, obj]
    setMainCompetency(removeById)
  }

  const updateById = (e, id) => {
    const updateValue = { competency_id: id, competency_name: e.target.value }
    const removeById = MainCompetency.filter(data => {
      return data.competency_id !== id
    })

    const updateState = [updateValue, ...removeById]
    const sortState = updateState.sort((a, b) => (a.competency_id > b.competency_id ? 1 : -1))
    setMainCompetency(sortState)
    // console.log(sortState)
  }
  // const initialsState = {
  //   subject_id: subject.subject_id,
  //   compettencie_name: ''
  // }

  // const [state, setState] = useState(initialsState)

  const checkIsEmpty = object => {
    var isEmpty = false

    Object.keys(object).forEach(function (key) {
      var val = object[key]
      if (val === '' || (val === 0 && key !== 'ref_curriculum_id')) {
        isEmpty = true
      }
    })

    if (isEmpty) {
      alert('Please Fill All TextFields')
    }

    return isEmpty
  }

  // useEffect(() => {
  //   // setState(pre => ({ ...pre, subject_id: subjectSelection }))
  // }, [subjectSelection])

  // reset state when open/close
  // useEffect(() => {
  //   // setState(initialsState)
  //   console.log(MainCompetency)
  // }, [open])

  // useEffect(() => {
  //   console.log(state)
  // }, [state])

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={'lg'} fullWidth>
      <DialogContent sx={{ minHeight: 450 }}>
        {delay ? (
          <Box sx={{ m: 12 }}>
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
                          // onClick={submitMain}
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
