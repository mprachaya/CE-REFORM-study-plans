import { Box, Button, Divider, Grid, MenuItem, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { CircleLoading, Selection } from 'src/components'
import { url } from 'src/configs/urlConfig'
import { useFetch } from 'src/hooks'

function curriculumstructure() {
  const textSize = 14
  const detailColor = 'gray'
  const URL_GET_SUBJECT_GROUPS = `${url.BASE_URL}/subject-groups/`
  const initialize = { subjectGroups: [] }
  const [state, setState] = useState({
    subjectGroups: []
  })
  const [row, setRow] = useState(null)
  const [subjectGroupSelected, setSubjectGroupSelected] = useState(0)

  const {
    error: SubjectGroupsError,
    data: SubjectGroups,
    loading: SubjectGroupsLoading
  } = useFetch(URL_GET_SUBJECT_GROUPS)

  const handleAddSubjectGroups = () => {
    if (row !== null) {
      const newObject = {
        subject_group_id: row.subject_group_id,
        subject_group_name: row.subject_group_name,
        total_credit: 0
      }
      setState(prevState => ({
        ...prevState,
        subjectGroups: [...prevState.subjectGroups, newObject] // Add the new object to the array
      }))
    } else if (row !== null) {
      alert('Subject Group already exists!')
    } else {
      alert('Please select a Subject Group')
    }
    setRow(null)
    setSubjectGroupSelected(0)
  }

  useEffect(() => {
    console.log(state)
  }, [state])

  const CurriculumDetails = () => (
    <Grid container mt={6} spacing={2}>
      <Grid item xs={3} sm={2}>
        <Typography fontSize={textSize}>Name(TH) :</Typography>
      </Grid>
      <Grid item xs={9} sm={4}>
        <Typography color={detailColor} fontSize={textSize}>
          sssssssssssssssss
        </Typography>
      </Grid>
      <Grid item xs={3} sm={2}>
        <Typography fontSize={textSize}>Name(EN) :</Typography>
      </Grid>
      <Grid item xs={9} sm={4}>
        <Typography color={detailColor} fontSize={textSize}>
          ssssssssssssssssssssss
        </Typography>
      </Grid>
      <Grid item xs={3} sm={2}>
        <Typography fontSize={textSize}>Faculty:</Typography>
      </Grid>
      <Grid item xs={9} sm={10}>
        <Typography color={detailColor} fontSize={textSize}>
          ssssssssssssssssssssss
        </Typography>
      </Grid>
      <Grid item xs={3} sm={2}>
        <Typography fontSize={textSize}>Subject Group:</Typography>
      </Grid>
      <Grid item xs={9} sm={4}>
        <Typography color={detailColor} fontSize={textSize}>
          ssssssssssssssssssssss
        </Typography>
      </Grid>
      <Grid item xs={3} sm={2}>
        <Typography fontSize={textSize}>Curriculum Year:</Typography>
      </Grid>
      <Grid item xs={9} sm={4}>
        <Typography color={detailColor} fontSize={textSize}>
          256X
        </Typography>
      </Grid>
    </Grid>
  )

  if (SubjectGroupsLoading) {
    return <CircleLoading />
  }
  if (SubjectGroupsError) {
    return <Box>Error Fetching...</Box>
  }

  return (
    <Box m={6}>
      <Typography variant='h6'>Curriculums Structure</Typography>
      <CurriculumDetails />

      <Grid container display={'flex'} my={6} ml={0}>
        <Grid item xs={12}>
          <Box mr={4} mb={2} mt={2} ml={0} display={'flex'} justifyContent={'space-between'}>
            <Typography sx={{ m: 2 }} fontSize={12}>
              Subject Group
            </Typography>

            <Box display='flex' width={170}>
              <Typography sx={{ m: 2 }} fontSize={12}>
                Total Credit
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ mt: 2, mb: 4 }} />
          {Object.values(state.subjectGroups)?.map((sjg, index) => (
            <Box
              mr={4}
              pb={2}
              mt={2}
              ml={0}
              display={'flex'}
              justifyContent={'space-between'}
              key={sjg.subject_group_id}
            >
              <Typography sx={{ m: 2 }} variant='body1'>
                {index + 1} . {' ' + sjg.subject_group_name}
              </Typography>
              <Box display={'flex'} flexDirection={'row'}>
                <TextField sx={{ width: 80, m: 2 }} size={'small'} fullWidth value={sjg.total_credit} />
                <Button
                  variant={'text'}
                  sx={{ px: 9 }}
                  onClick={() => {
                    const findById = Object.values(state.subjectGroups)?.find(
                      s => s.subject_group_id === sjg.subject_group_id
                    )
                    const UpdateState = Object.values(state.subjectGroups)?.filter(sj => sj !== findById)
                    UpdateState.length !== 0 ? setState({ subjectGroups: UpdateState }) : setState(initialize)
                    // console.log(UpdateState)
                  }}
                >
                  X
                </Button>
              </Box>
            </Box>
          ))}
          <Box my={6} mr={4} mb={2} mt={2} ml={0} display={'flex'} justifyContent={'space-between'} minWidth={200}>
            <Selection
              firstItemText={'เลือกกลุ่มวิชา'}
              label={'Subject Group'}
              width={200}
              selectionValue={String(subjectGroupSelected)}
              handleChange={e => setSubjectGroupSelected(e.target.value)}
              Items={Object.values(SubjectGroups)?.map(sjg => (
                <MenuItem
                  onClick={() => {
                    const checkUniqId = Object.values(state.subjectGroups)?.find(
                      sg => sjg.subject_group_id === sg.subject_group_id
                    )
                    if (!checkUniqId) {
                      setRow(sjg)
                    } else {
                      setRow(null)
                    }
                    console.log(checkUniqId)
                  }}
                  key={sjg.subject_group_id}
                  value={sjg.subject_group_id}
                >
                  {sjg.subject_group_name}
                </MenuItem>
              ))}
            />
            <Button onClick={() => handleAddSubjectGroups(row)} variant={'contained'} sx={{ width: 160 }}>
              +
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} my={4}>
          <Box borderRadius={2} bgcolor={'AppWorkspace'} minHeight={500}></Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default curriculumstructure
