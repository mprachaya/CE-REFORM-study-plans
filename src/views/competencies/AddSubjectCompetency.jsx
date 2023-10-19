import {
  Dialog,
  Typography,
  DialogContent,
  Grid,
  TextField,
  MenuItem,
  FormGroup,
  FormControlLabel,
  DialogActions,
  Checkbox,
  Box,
  Button
} from '@mui/material'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import Selection from 'src/components/Selection'
import { handleChangeEN, handleChangeNumber, handleChangeTH } from 'src/hooks/useValidation'

function AddSubjectCompetency({ open, handleClose, handleSubmit, subject }) {
  const [subjectSelection, setsubjectSelection] = useState(subject.subject_id)

  const [mainCompetency, setMainCompetency] = useState([{ test: 1 }, { test: 2 }])
  // const [subCompetency, setSubCompetency] = useState([])
  const submitMain = () => {
    const obj = { test: 1 }
    const mainTemp = [...mainCompetency, obj]
    setMainCompetency(mainTemp)
  }


  const initialsState = {
    subject_id: subject.subject_id,
    compettencie_name: '',
  }

  const [state, setState] = useState(initialsState)

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
    setState(pre => ({ ...pre, subject_id: subjectSelection }))
  }, [subjectSelection])

  // reset state when open/close
  useEffect(() => {
    setState(initialsState)
  }, [open])

  useEffect(() => {
    console.log(state)
  }, [state])

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={'lg'} fullWidth>
      <DialogContent sx={{ minHeight: 450 }}>
        <Typography variant='body2' sx={{ mt: 5, ml: 5 }}>
          Subject Compentency
          <Typography variant='h6'>  {subject.subject_name_th}</Typography>

        </Typography>
        <DialogContent >
          <Grid container spacing={2} >
            {mainCompetency.map((index) => (
              <Box key={index} sx={{ width: '100%', p: 2, m: 2, border: 1, borderColor: 'lightgray', borderRadius: 2, }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={6} lg={9} >
                    <TextField
                      fullWidth
                      name={'curriculum_name_th'}
                      label='ทักษะ สมรรถนะ'
                      onChange={e => handleChangeTH(e, setState)}
                      value={state.curriculum_name_th}
                    />

                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={3}>
                    <Button variant='contained' sx={{ m: 2 }} onClick={submitMain}>Submit</Button>
                  </Grid>
                  <Grid container item xs={12} sm={12} md={6} lg={12} direction={'row'}>
                    <Grid item xs={12}  >
                      <Button sx={{ m: 2 }}>+ รายการสมรรถนะย่อย</Button>
                    </Grid>

                    <Grid container item xs={12} sm={12} md={6} lg={12} spacing={2}>
                      <Grid item xs={0.2} />
                      <Grid item xs={12} sm={12} md={6} lg={5.8} >
                        <TextField

                          fullWidth
                          name={'curriculum_name_th'}
                          label='สมรรถนะย่อย'
                          onChange={e => handleChangeTH(e, setState)}
                          value={state.curriculum_name_th}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={6}>
                        <Button sx={{ my: 2 }}>Submit</Button>

                        <Button sx={{ my: 2 }}>Update</Button>
                        <Button sx={{ my: 2, color: 'red' }}>Delete</Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            ))}

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
