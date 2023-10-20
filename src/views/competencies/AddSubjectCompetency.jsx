import { Dialog, Typography, DialogContent, Grid, TextField, DialogActions, Box, Button } from '@mui/material'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
// import Selection from 'src/components/Selection'
// import { handleChangeEN, handleChangeNumber, handleChangeTH } from 'src/hooks/useValidation'

function AddSubjectCompetency({ open, handleClose, handleSubmit, subject }) {
  const [competencieName, setCompetencieName] = useState('')
  const [subjectSelection, setsubjectSelection] = useState(subject.subject_id)

  const [mainCompetency, setMainCompetency] = useState([
    { competencie_id: 1, competencie_name: 'test1' },
    { competencie_id: 2, competencie_name: 'test2' }
  ])
  // const [subCompetency, setSubCompetency] = useState([])
  const submitMain = comName => {
    const obj = {
      competencie_id: parseInt(mainCompetency.length) + 1,
      competencie_name: comName
    }
    const mainTemp = [...mainCompetency, obj]
    setMainCompetency(mainTemp)
    setCompetencieName('')
  }
  const deleteMain = id => {
    // const obj = {
    //   competencie_id: parseInt(mainCompetency.length) + 1,
    //   competencie_name: 'test' + (parseInt(mainCompetency.length) + 1)
    // }
    const obj = mainCompetency
    const removeById = obj.filter(data => {
      return data.competencie_id !== id
    })
    // console.log(removeById)
    // const mainTemp = [...mainCompetency, obj]
    setMainCompetency(removeById)
  }

  const updateById = (e, id) => {
    const updateValue = { competencie_id: id, competencie_name: e.target.value }
    const removeById = mainCompetency.filter(data => {
      return data.competencie_id !== id
    })

    const updateState = [updateValue, ...removeById]
    const sortState = updateState.sort((a, b) => (a.competencie_id > b.competencie_id ? 1 : -1))
    setMainCompetency(sortState)
    console.log(sortState)
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

  useEffect(() => {
    // setState(pre => ({ ...pre, subject_id: subjectSelection }))
  }, [subjectSelection])

  // reset state when open/close
  useEffect(() => {
    // setState(initialsState)
    console.log(mainCompetency)
  }, [open])

  // useEffect(() => {
  //   console.log(state)
  // }, [state])

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={'lg'} fullWidth>
      <DialogContent sx={{ minHeight: 450 }}>
        <Box sx={{ mt: 5, ml: 5 }}>
          <Typography variant='body2'> Subject Compentency</Typography>
          <Typography variant='h6'> {subject.subject_name_th}</Typography>
        </Box>
        <DialogContent>
          <Grid container spacing={2}>
            {mainCompetency.map((mainCom, index) => (
              <Box
                key={mainCom.competencie_id}
                sx={{ width: '100%', p: 2, m: 2, border: 1, borderColor: 'lightgray', borderRadius: 2 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography sx={{ m: 2 }}>{index + 1}.</Typography>
                  </Grid>

                  <Grid item xs={12} sm={12} md={10} lg={9}>
                    <TextField
                      fullWidth
                      // name={'competencie_name'}
                      label='ทักษะ สมรรถนะ'
                      onChange={e => {
                        updateById(e, mainCom.competencie_id)
                      }}
                      value={mainCom.competencie_name || ''}
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
                  <Grid item xs={12} sm={12} md={2} lg={1}>
                    <Button
                      variant='outlined'
                      sx={{ px: 2, width: '100%', height: '100%', color: 'red', borderColor: 'red' }}
                      onClick={() => deleteMain(mainCom.competencie_id)}
                    >
                      Delete
                    </Button>
                  </Grid>
                  <Grid container item xs={12} sm={12} md={6} lg={12} direction={'row'}>
                    <Grid item xs={12}>
                      <Button sx={{ m: 2 }}>+ รายการสมรรถนะย่อย</Button>
                    </Grid>

                    {/* <Grid container item xs={12} sm={12} md={6} lg={12} spacing={2}>
                      <Grid item xs={0.2} />
                      <Grid item xs={12} sm={12} md={6} lg={5.8}>
                        <TextField
                          fullWidth
                          name={'curriculum_name_th'}
                          label='สมรรถนะย่อย'
                          // onChange={e => handleChangeTH(e, setState)}
                          // value={state.curriculum_name_th}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={6}>
                        <Button sx={{ my: 2 }}>Submit</Button>

                        <Button sx={{ my: 2 }}>Update</Button>
                        <Button sx={{ my: 2, color: 'red' }}>Delete</Button>
                      </Grid>
                    </Grid> */}
                  </Grid>
                </Grid>
              </Box>
            ))}
            <Box sx={{ width: '100%', p: 2, m: 2, border: 1, borderColor: 'lightgray', borderRadius: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={10} lg={9}>
                  <TextField
                    fullWidth
                    // name={'competencie_name'}
                    label='ทักษะ สมรรถนะ'
                    onChange={e => setCompetencieName(e.target.value)}
                    value={competencieName || ''}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={2} lg={3}>
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
          </Grid>
        </DialogContent>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='secondary'>
          Cancel
        </Button>
        {/* <Button onClick={() => !checkIsEmpty(state) && handleSubmit(state)}>Submit</Button> */}
        {/* <Button onClick={() => !checkIsEmpty(state) && handleSubmit(state)}>Submit</Button> */}
      </DialogActions>
    </Dialog>
  )
}

export default AddSubjectCompetency
