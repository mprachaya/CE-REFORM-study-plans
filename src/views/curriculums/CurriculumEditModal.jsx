import React, { useEffect, useState } from 'react'
import { Dialog, Typography, DialogContent, Grid, TextField, DialogActions, Button, MenuItem } from '@mui/material'

import Icon from '@mdi/react'
import { mdiSitemapOutline, mdiPen, mdiDelete, mdiFlag } from '@mdi/js'
import Selection from 'src/components/Selection'
import { handleChangeEN, handleChangeNumber, handleChangeTH } from 'src/hooks/useValidation'
import { useRouter } from 'next/router'

function CurriculumEditModal({ state, open, handleClose, faculty, studentGroups, handleUpdate, openConfirmDelete }) {
  const router = useRouter()

  const [updateState, setUpdateState] = useState([])

  const checkIsEmpty = object => {
    var isEmpty = false

    Object.keys(object).forEach(function (key) {
      var val = object[key]
      if (val === '') {
        isEmpty = true
      }
    })

    if (isEmpty) {
      alert('Please Fill All TextFields')
    }

    return isEmpty
  }

  // new Object to get some properties
  useEffect(() => {
    if (open) {
      const {
        collegian_group_id,
        curriculum_id,
        curriculum_name_en,
        curriculum_name_th,
        curriculum_short_name_en,
        curriculum_short_name_th,
        curriculum_year,
        faculty_id
      } = state

      const newObj = {
        collegian_group_id: collegian_group_id,
        curriculum_id: curriculum_id,
        curriculum_name_en: curriculum_name_en,
        curriculum_name_th: curriculum_name_th,
        curriculum_short_name_en: curriculum_short_name_en,
        curriculum_short_name_th: curriculum_short_name_th,
        curriculum_year: curriculum_year,
        faculty_id: faculty_id
      }
      console.log('newObj :', newObj)
      setUpdateState(newObj)
    }
  }, [open])

  useEffect(() => {
    console.log(updateState)
  }, [updateState])

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={'lg'} fullWidth>
      <DialogContent sx={{ minHeight: 450 }}>
        <Grid container>
          <Grid
            container
            item
            xs={12}
            sx={{
              display: 'flex',
              justifyContent: { xs: 'center', md: 'space-between' },
              m: { xs: 2, md: 6 },
              textAlign: { xs: 'center ', md: 'start' }
            }}
          >
            <Grid item xs={12} sm={12} md={3} lg={3}>
              <Typography variant='h6'>Edit Curriculum</Typography>
            </Grid>
            <Grid container item xs={8} spacing={2} justifyContent={{ sx: 'center', md: 'end' }}>
              <Grid item xs={12} sm={11} md={4} lg={3}>
                <Button
                  fullWidth
                  color='secondary'
                  variant='outlined'
                  startIcon={<Icon path={mdiSitemapOutline} size={0.75} />}
                  onClick={() =>
                    router.push({
                      pathname: '/pages/masterdata/curriculums/curriculumstructure',
                      query: { curriculum_id: state.curriculum_id }
                    })
                  }
                >
                  Structure
                </Button>
              </Grid>
              <Grid item xs={12} sm={11} md={4} lg={3}>
                <Button
                  fullWidth
                  onClick={() =>
                    router.push(
                      {
                        pathname: '/pages/masterdata/subjects',
                        query: { curriculum_id: state.curriculum_id }
                      },
                      '/pages/masterdata/subjects'
                    )
                  }
                  color='secondary'
                  variant='outlined'
                  startIcon={<Icon path={mdiPen} size={0.75} />}
                >
                  Subjects
                </Button>
              </Grid>
              <Grid item xs={12} sm={11} md={4} lg={3}>
                <Button
                  fullWidth
                  color='secondary'
                  variant='outlined'
                  startIcon={<Icon path={mdiFlag} size={0.75} />}
                  onClick={() =>
                    router.push({
                      pathname: '/pages/masterdata/curriculums/studyplans'
                      // query: { curriculum_id: state.curriculum_id }
                    })
                  }
                >
                  Study Plans
                </Button>
              </Grid>
              <Grid item xs={12} sm={11} md={4} lg={3}>
                <Button
                  fullWidth
                  color='error'
                  variant='outlined'
                  onClick={() => openConfirmDelete()}
                  startIcon={<Icon bgcolor='red' path={mdiDelete} size={0.75} />}
                >
                  Delete
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <DialogContent sx={{ display: 'flex' }}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={12} md={12} lg={6}>
              <TextField
                fullWidth
                name={'curriculum_name_th'}
                label='Curriculum Name TH *'
                placeholder='Thai Only'
                onChange={e => handleChangeTH(e, setUpdateState)}
                value={updateState.curriculum_name_th || ''}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={6}>
              <TextField
                fullWidth
                name={'curriculum_name_en'}
                label='Curriculum Name EN *'
                placeholder='English Only'
                onChange={e => handleChangeEN(e, setUpdateState)}
                value={updateState.curriculum_name_en || ''}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={6}>
              <TextField
                fullWidth
                name={'curriculum_short_name_th'}
                label='Curriculum Short Name TH *'
                placeholder='Thai Only'
                onChange={e => handleChangeTH(e, setUpdateState)}
                value={updateState.curriculum_short_name_th || ''}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={6}>
              <TextField
                fullWidth
                name={'curriculum_short_name_en'}
                label='Curriculum Short Name EN *'
                placeholder='English Only'
                onChange={e => handleChangeEN(e, setUpdateState)}
                value={updateState.curriculum_short_name_en || ''}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogContent sx={{ display: 'flex' }}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={12} md={12} lg={6}>
              <Selection
                width={'100%'}
                firstItemText={'Choose Faculty *'}
                selectionValue={String(updateState.faculty_id)}
                handleChange={e => setUpdateState(pre => ({ ...pre, faculty_id: parseInt(e.target.value) }))}
                Items={Object.values(faculty)?.map(fac => (
                  <MenuItem key={fac.faculty_id} value={fac.faculty_id}>
                    {fac.faculty_name_th}
                  </MenuItem>
                ))}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={6}>
              <Selection
                width={'100%'}
                firstItemText={'Choose Student Groups *'}
                selectionValue={String(updateState.collegian_group_id)}
                handleChange={e => setUpdateState(pre => ({ ...pre, collegian_group_id: parseInt(e.target.value) }))}
                Items={Object.values(studentGroups)?.map(stdg => (
                  <MenuItem key={stdg.collegian_group_id} value={stdg.collegian_group_id}>
                    {stdg.collegian_group_short_name_th}
                  </MenuItem>
                ))}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={6}>
              <TextField
                type='number'
                name={'curriculum_year'}
                value={updateState.curriculum_year || ''}
                onChange={e => handleChangeNumber(e, setUpdateState)}
                fullWidth
                label='Year *'
                placeholder='Number Only '
              />
            </Grid>
          </Grid>
        </DialogContent>
        {/* <DialogContent sx={{ display: 'flex' }}></DialogContent> */}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='secondary'>
          Cancel
        </Button>
        <Button onClick={() => !checkIsEmpty(updateState) && handleUpdate(updateState)}>Update</Button>
      </DialogActions>
    </Dialog>
  )
}

export default CurriculumEditModal
