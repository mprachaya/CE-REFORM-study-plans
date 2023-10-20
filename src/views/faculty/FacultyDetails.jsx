import React, { useState } from 'react'
import { Dialog, Typography, Grid, DialogActions, Button, DialogContent, Box } from '@mui/material'
import DataGridTable from 'src/components/DataGridTable'
import { useFetch } from 'src/hooks'
import { CircleLoading } from 'src/components'
import { useEffect } from 'react'
import { url } from 'src/configs/urlConfig'

function FacultyDetailsModal({ facultyId, state, open, handleClose }) {
  const [nullCurriculums, setNullCurriculums] = useState(true)
  const [textNullSubject, setTextNullSubject] = useState('')
  const [getfacultyId, setfacultyId] = useState(0)
  const [delay, setDelay] = useState(true)

  const URL_GET_CURRICULUM = `${url.BASE_URL}/faculties/${getfacultyId}`
  const { error: CurriculumsError, data: Curriculums, loading: CurriculumsLoading } = useFetch(URL_GET_CURRICULUM)

  const details_columns = [
    { field: 'curriculum_year', headerName: 'Year', width: 100 },
    { field: 'curriculum_name_th', headerName: 'Curriculum Name TH', width: 300 },
    { field: 'curriculum_name_en', headerName: 'Curriculum Name EN', width: 300 }
  ]

  useEffect(() => {
    if (open) {
      setfacultyId(facultyId)
      setDelay(true)
      setTimeout(() => {
        setDelay(false)
      }, 600)
    } else {
      setfacultyId(0)
    }
  }, [open])

  useEffect(() => {
    if (CurriculumsLoading) {
    } else {
      // if (!CurriculumsLoading && Curriculums[0].curriculumlength > 0) {
      //   setNullCurriculums(false)
      //   setTextNullSubject('')
      // } else {
      //   setNullCurriculums(true)
      //   setTextNullSubject('Not Have Any Curriculums.')
      // }
    }
  }, [CurriculumsLoading])

  useEffect(() => {
    if (Curriculums) {
      console.log(Curriculums)
    }
  }, [Curriculums])

  if (!CurriculumsLoading && !delay) {
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
      {!CurriculumsLoading && (
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
                      Faculty Name (TH) :
                    </Typography>
                  </Grid>
                  <Grid item xs={4} sm={6} md={2.5} lg={2}>
                    <Typography variant='caption'>{state.faculty_name_th}</Typography>
                  </Grid>
                  <Grid item xs={8} sm={6} md={5} lg={1.5}>
                    <Typography variant='body2' sx={{ minWidth: 120 }}>
                      Faculty Name (EN) :
                    </Typography>
                  </Grid>
                  <Grid item xs={4} sm={6} md={2.5} lg={6}>
                    <Typography variant='caption'> {state.faculty_name_en}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container>
            {Object.values(Curriculums.curriculums).length !== 0 ? (
              <Grid container item sx={{ ml: 10, mr: 10 }} xs={12}>
                <Grid item xs={12}>
                  <DataGridTable rows={Curriculums.curriculums} columns={details_columns} uniqueKey={'curriculum_id'} />
                </Grid>
              </Grid>
            ) : (
              <Grid item sx={{ ml: 10, mr: 10 }}>
                <Grid item xs={12} sm={12} lg={12}>
                  <Typography>{'ยังไม่มีหลักสูตร'}</Typography>
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

export default FacultyDetailsModal
