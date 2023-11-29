import React, { useState } from 'react'
import { Dialog, Typography, Grid, DialogActions, Button, DialogContent, Box } from '@mui/material'
import DataGridTable from 'src/components/DataGridTable'
import { useFetch } from 'src/hooks'
import { CircleLoading } from 'src/components'
import { useEffect } from 'react'
import { url } from 'src/configs/urlConfig'

function CurriculumDetailsModal({ curriculumId, state, open, handleClose, rows_details, columns_details }) {
  const [nullSubjects, setNullSubjects] = useState(null)
  const [textNullSubject, setTextNullSubject] = useState('')
  const [getCurriculumId, setCurriculumId] = useState(0)
  const [delay, setDelay] = useState(true)

  const URL_GET_SUBJECT = `${url.BASE_URL}/subjects-by-curriculum/${getCurriculumId}`
  const { error: SubjectsError, data: Subjects, loading: SubjectsLoading } = useFetch(URL_GET_SUBJECT)

  const details_columns = [
    { field: 'subject_code', headerName: 'Code', width: 120 },
    { field: 'subject_name_th', headerName: ' Subject Name TH', width: 280 },
    { field: 'subject_name_en', headerName: 'Subject Name EN', width: 300 },
    { field: 'subject_credit', headerName: 'Credit', width: 140 },
    {
      field: 'subject_group_name',
      headerName: 'Group Type',
      width: 220,
      valueGetter: params => params.row?.subject_groups?.subject_group_name
    }
  ]

  useEffect(() => {
    if (open) {
      setCurriculumId(curriculumId)
      setDelay(true)
      setTimeout(() => {
        setDelay(false)
      }, 600)
    } else {
      setCurriculumId(0)
    }
  }, [open,curriculumId])

  useEffect(() => {
    if (SubjectsLoading) {
    } else {
      if (!SubjectsLoading && Subjects.length > 0) {
        setNullSubjects(false)
        setTextNullSubject('')
      } else {
        setNullSubjects(true)
        setTextNullSubject('Not Have Any Subjects.')
      }
    }
  }, [SubjectsLoading])

  useEffect(() => {
    if (Subjects) {
      console.log(Subjects)
    }
  }, [Subjects])

  if (!SubjectsLoading && !delay) {
  } else {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth={'lg'} fullWidth>
        <DialogContent sx={{ minHeight: 450 }}>
          <Box sx={{ mt: 30 }}>
            <CircleLoading />
          </Box>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={'lg'} fullWidth>
      {!SubjectsLoading && (
        <DialogContent sx={{ minHeight: 450 }}>
          <Grid container>
            <Grid item sx={{ mt: 10, ml: 10 }} xs={12}>
              <Typography variant='h6'>Curriculums Details</Typography>
            </Grid>
            <Grid item xs={12} container sx={{ mt: 4, mb: 6, ml: 10 }}>
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={8} sm={6} md={5} lg={1.5}>
                    <Typography variant='body2' sx={{ minWidth: 120 }}>
                      Curriculum (TH) :
                    </Typography>
                  </Grid>
                  <Grid item xs={4} sm={6} md={2.5} lg={2}>
                    <Typography variant='caption'>{state.curriculum_short_name_th}</Typography>
                  </Grid>
                  <Grid item xs={8} sm={6} md={5} lg={1.5}>
                    <Typography variant='body2' sx={{ minWidth: 120 }}>
                      Curriculum (EN) :
                    </Typography>
                  </Grid>
                  <Grid item xs={4} sm={6} md={2.5} lg={6}>
                    <Typography variant='caption'> {state.curriculum_short_name_en}</Typography>
                  </Grid>
                  <Grid item xs={8} sm={6} md={5} lg={1.5}>
                    <Typography variant='body2' sx={{ minWidth: 120 }}>
                      Faculty :
                    </Typography>
                  </Grid>
                  <Grid item xs={4} sm={6} md={2.5} lg={2}>
                    <Typography variant='caption'>{state.faculty.faculty_name_th}</Typography>
                  </Grid>
                  <Grid item xs={8} sm={6} md={5} lg={1.5}>
                    <Typography variant='body2' sx={{ minWidth: 120 }}>
                      Student Group :
                    </Typography>
                  </Grid>
                  <Grid item xs={4} sm={6} md={2.5} lg={6}>
                    <Typography variant='caption'> {state.collegian_groups.collegian_group_short_name_th}</Typography>
                  </Grid>
                  <Grid item xs={8} sm={6} md={5} lg={1.5}>
                    <Typography variant='body2' sx={{ minWidth: 120 }}>
                      Year :
                    </Typography>
                  </Grid>
                  <Grid item xs={4} sm={6} md={2.5} lg={2}>
                    <Typography variant='caption'> {state.curriculum_year}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container>
            {!nullSubjects ? (
              <Grid item sx={{ ml: 10, mr: 10 }}>
                <Grid item xs={12}>
                  <DataGridTable rows={Subjects} columns={details_columns} uniqueKey={'subject_id'} />
                </Grid>
              </Grid>
            ) : (
              <Grid item sx={{ ml: 10, mr: 10 }}>
                <Grid item xs={12} sm={12} lg={12}>
                  <Typography>{textNullSubject}</Typography>
                </Grid>
              </Grid>
            )}
          </Grid>
          <DialogActions sx={{ mt: 20 }}>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </DialogContent>
      )}
    </Dialog>
  )
}

export default CurriculumDetailsModal
