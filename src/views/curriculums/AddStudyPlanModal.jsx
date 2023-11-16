import { Dialog, Typography, DialogContent, Grid, TextField, MenuItem, DialogActions, Button } from '@mui/material'

import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { CircleLoading } from 'src/components'
import Selection from 'src/components/Selection'
import { url } from 'src/configs/urlConfig'
import { useFetch } from 'src/hooks'

function AddStudyPlanModal({ open, handleClose, curriculumId, handleSubmit }) {
  const URL_GET_CURRICULUMS = `${url.BASE_URL}/curriculums/`

  const { data: Curriculums } = useFetch(URL_GET_CURRICULUMS)

  const [createByValue, setCreateByValue] = useState(0)
  const [planSelected, setPlanSeleted] = useState(0)
  const [planName, setPlanName] = useState('')

  // console.log(StudyPlans)
  const initialsState = {
    curriculum_id: curriculumId,
    study_plan_name: '',
    // study_plan_version: 1,
    study_plan_total_credit: 0
  }
  const [state, setState] = useState(initialsState)

  const [duplicateSubPlans, setDuplicateSubPlan] = useState([])

  const [isDone, setIsDone] = useState(null)

  useEffect(() => {
    console.log(state)
  }, [state])

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={'lg'} fullWidth>
      <DialogContent sx={{ minHeight: 450 }}>
        <Typography variant='h6' sx={{ mt: 5, ml: 5 }}>
          Add new study plan
        </Typography>
        {!isDone && isDone !== null ? (
          <Grid
            container
            spacing={0}
            direction={'column'}
            alignItems={'center'}
            justifyContent={'center'}
            sx={{ minHeight: '60vh' }}
          >
            <Grid item xs={6}>
              <Typography m={2}> In Processing.....</Typography>
              <CircleLoading />
            </Grid>
          </Grid>
        ) : (
          <React.Fragment>
            <DialogContent sx={{ display: 'flex' }}>
              <Grid container spacing={6}>
                <React.Fragment>
                  <Grid item xs={12} sm={12} md={12} lg={6}>
                    <Selection
                      width={'100%'}
                      disableSelect={true}
                      // firstItemText={'Choose Curriculum *'}
                      selectionValue={curriculumId}
                      // handleChange={e => setState(pre => ({ ...pre, curriculum_id: e.target.value }))}
                      Items={Object.values(Curriculums)?.map(curr => (
                        <MenuItem disabled key={curr.curriculum_id} value={curr.curriculum_id}>
                          {curr.curriculum_name_th}
                        </MenuItem>
                      ))}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} md={12} lg={6}>
                    <TextField
                      fullWidth
                      name={'study_plan_name'}
                      label='Study Plan Name *'
                      onChange={e => setState(pre => ({ ...pre, study_plan_name: e.target.value }))}
                      value={state?.study_plan_name || ''}
                    />
                  </Grid>
                </React.Fragment>
              </Grid>
            </DialogContent>
          </React.Fragment>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setState(initialsState)
            handleClose()
          }}
          color='secondary'
        >
          Cancel
        </Button>

        <Button onClick={() => handleSubmit(state, createByValue, setIsDone, duplicateSubPlans)}>Create</Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddStudyPlanModal
