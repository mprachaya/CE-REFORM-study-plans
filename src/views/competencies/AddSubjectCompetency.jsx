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
  const [competencieSubName, setCompetencieSubName] = useState([])
  // const [competencieSubName, setCompetencieSubName] = useState('')
  // const [subjectSelection, setsubjectSelection] = useState(subject.subject_id)
  // const [delay, setDelay] = useState(false)
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackMassage, setSnackMassage] = useState('')
  const [openDescription, setOpenDescription] = useState(false)

  const URL_GET_SUBJECT_COMPETENCIES_BY_ID = `${url.BASE_URL}/subjects/${subject.subject_id}`
  const URL_GET_MAIN_COMPETENCIES = `${url.BASE_URL}/competencies/`
  const URL_SUB_COMPETENCIES = `${url.BASE_URL}/competency-subs/`

  const {
    error: CompetenciesError,
    data: Competencies,
    setData: setCompetencies,
    reFetch: reFetchCompetencies,
    loading: CompetenciesLoading
  } = useFetch(URL_GET_SUBJECT_COMPETENCIES_BY_ID)

  const [MainBySubject, setMainBySubject] = useState([])
  const [CompetenciesTemp, setCompetencyTemp] = useState([])

  useEffect(() => {
    if (!CompetenciesLoading) {
      console.log('Competencies', Competencies)
      setCompetencyTemp(Competencies)
    }
  }, [CompetenciesLoading])

  useEffect(() => {
    if (CompetenciesTemp) {
      const DetectMainCom = CompetenciesTemp.competencies?.length
      if (DetectMainCom > 0) {
        // console.log('DetectMainCom', DetectMainCom)
        // const newArraySubName = Array.from(DetectMainCom, (_, i) => ({ index: i, subName: '' }))
        const newArraySubName = Object.values(CompetenciesTemp.competencies)?.map((data, i) => ({
          index: i,
          subName: ''
        }))
        setCompetencieSubName(newArraySubName)
        // console.log(newArraySubName)
      }
    }
  }, [CompetenciesTemp])

  // useEffect(()=>{
  //   if(CompetenciesTemp){
  //     const newNameArray = Competencies.competencies?.map((data) => )
  //     setCompetencieSubName()
  //   }
  // },[CompetenciesTemp])

  const updateComSubjects = com => {
    let obj = subject
    if (obj) {
      const removeById = subjects.filter(data => {
        return data.subject_id !== obj.subject_id
      })
      obj.competencies = com
      const mainTemp = [...removeById, obj]
      setSubjects(mainTemp)
    }
  }

  const submitMain = comName => {
    let obj = {
      competency_id: 0,
      competency_name: comName,
      competency_sub: []
    }
    axios
      .post(URL_GET_MAIN_COMPETENCIES, { subject_id: subject.subject_id, competency_name: comName })
      .then(res => {
        obj.competency_id = res.data.data.competency_id
        const mainTemp = [...CompetenciesTemp.competencies, obj]
        console.log(mainTemp)
        updateComSubjects(mainTemp)
        setCompetencyTemp(pre => ({ ...pre, competencies: [...CompetenciesTemp.competencies, obj] }))
        setSnackMassage('Insert Success!')
      })
      .catch(err => setSnackMassage(err))
      .finally(() => {
        setOpenSnackbar(true)
        setCompetencieSubName('')
      })
  }
  const submitSub = (mainId, comName) => {
    if (mainId && comName) {
      let obj = {
        competency_sub_id: 0,
        competency_id: mainId,
        competency_sub_name: comName,
        competency_sub_description: null
      }
      axios
        .post(URL_SUB_COMPETENCIES, {
          competency_id: mainId,
          competency_sub_name: comName,
          competency_sub_description: null
        })
        .then(res => {
          obj.competency_sub_id = res.data.data.competency_sub_id
          const findMainById = CompetenciesTemp.competencies?.filter(data => {
            return data.competency_id === mainId
          })
          findMainById[0].competency_sub = [...findMainById[0].competency_sub, obj]

          setSnackMassage('Insert Success!')
        })
        .catch(err => setSnackMassage(err))
        .finally(() => {
          setOpenSnackbar(true)
          setCompetencieSubName('')
        })
    }
  }
  const deleteMain = id => {
    let result = window.confirm('Confirm to Delete?')
    if (result) {
      axios
        .delete(URL_GET_MAIN_COMPETENCIES + id)
        .then(res => {
          setSnackMassage('Delete Success!')
          const obj = CompetenciesTemp.competencies
          const removeById = obj.filter(data => {
            return data.competency_id !== id
          })
          setCompetencyTemp(pre => ({ ...pre, competencies: removeById }))
          updateComSubjects(removeById)
        })
        .catch(err => setSnackMassage(err))
        .finally(() => {
          setOpenSnackbar(true)
        })
    } else {
    }
  }

  // for main competencies
  const updateById = (e, id) => {
    const findById = CompetenciesTemp.competencies.filter(data => {
      return data.competency_id === id
    })
    findById[0].competency_name = e.target.value

    const sortState = findById.sort((a, b) => (a.competency_id > b.competency_id ? 1 : -1))
    setCompetencyTemp(pre => ({ ...pre, sortState }))
  }
  // for sub competencies
  const updateSubById = (e, mainId, subId) => {
    const findMainById = CompetenciesTemp.competencies?.filter(data => {
      return data.competency_id === mainId
    })
    const findSubById = findMainById[0].competency_sub?.filter(data => {
      return data.competency_sub_id === subId
    })

    // console.log('main', findMainById)
    // console.log('sub', findSubById)
    findSubById[0].competency_sub_name = e.target.value
    // console.log(findSubById[0])
    const sortState = findSubById.sort((a, b) => (a.competency_sub_id > b.competency_sub_id ? 1 : -1))
    setCompetencyTemp(pre => ({ ...pre, sortState }))
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
  const confirmUpdateSub = (id, name, description) => {
    if (name !== '') {
      axios
        .put(URL_SUB_COMPETENCIES + id, { competency_sub_name: name, competency_sub_description: description })
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
        {CompetenciesLoading ? (
          <Box sx={{ width: '100%', height: '100%', mt: 12 }}>
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
                        onClick={() => competencieName !== '' && submitMain(competencieName)}
                      >
                        Submit
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
                <Typography sx={{ p: 2, pb: 1 }} variant='body1'>
                  รายการสมรรถนะหลัก
                </Typography>
                {CompetenciesTemp?.competencies?.map((mainCom, index) => (
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
                              {Object.values(mainCom.competency_sub).map(filterSub => (
                                <ListItem key={filterSub.competency_sub_id}>
                                  {/* <ListItemText primary={'- ' + filterSub.competency_sub_name} /> */}
                                  <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                      <TextField
                                        fullWidth
                                        // name={'curriculum_name_th'}
                                        label='สมรรถนะย่อย'
                                        onChange={e =>
                                          updateSubById(e, mainCom.competency_id, filterSub.competency_sub_id)
                                        }
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
                                        onClick={e =>
                                          confirmUpdateSub(
                                            filterSub.competency_sub_id,
                                            filterSub.competency_sub_name,
                                            filterSub.competency_sub_description
                                          )
                                        }
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
                              label='สมรรถนะย่อย'
                              onChange={e => {
                                const indexCheck = competencieSubName?.filter(check => check.index === index)
                                // console.log(indexCheck)
                                if (indexCheck) {
                                  indexCheck[0].subName = e.target.value
                                  const preState = competencieSubName?.filter(preData => preData.index !== index)
                                  const updateState = [...preState, ...indexCheck]
                                  setCompetencieSubName(updateState.sort((a, b) => a.index - b.index))
                                  // console.log(updateState.sort((a, b) => a.index - b.index))
                                }
                                // if()
                              }}
                              value={competencieSubName[index]?.subName}
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <Button
                              onClick={() =>
                                competencieSubName !== '' &&
                                submitSub(mainCom.competency_id, competencieSubName[index].subName)
                              }
                              variant='contained'
                              sx={{ height: '100%', width: '100%' }}
                            >
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
          <Button onClick={() => setOpenDescription(false)} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <SnackbarStyled open={openSnackbar} handleClose={() => setOpenSnackbar(false)} massage={snackMassage} />
    </Dialog>
  )
}

export default AddSubjectCompetency
