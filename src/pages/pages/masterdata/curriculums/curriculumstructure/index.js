import { Box, Button, Divider, Grid, ListItem, ListItemIcon, MenuItem, TextField, Typography } from '@mui/material'
import Icon from '@mdi/react'
import { mdiCheckboxBlankCircle } from '@mdi/js'
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
  const [subjectCategory, setSubjectCategory] = useState({
    category: []
  })
  const [subjectTypes, setSubjectTypes] = useState({
    type: []
  })
  const [totalSubjectType, setTotalSubjectType] = useState(null)
  const [row, setRow] = useState(null)
  const [subjectGroupSelected, setSubjectGroupSelected] = useState(0)

  const {
    error: SubjectGroupsError,
    data: SubjectGroups,
    loading: SubjectGroupsLoading
  } = useFetch(URL_GET_SUBJECT_GROUPS)

  console.log(SubjectGroups)

  const handleAddSubjectGroups = () => {
    if (row !== null) {
      const newObject = {
        subject_category_id: row?.subject_types.subject_category_id,
        subject_category_name: row?.subject_types.subject_categories.subject_category_name,
        subject_type_id: row?.subject_types.subject_type_id,
        subject_type_name: row?.subject_types.subject_type_name,
        subject_group_id: row?.subject_group_id,
        subject_group_name: row?.subject_group_name,
        total_credit: 3
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

  const handleChangeTotalCredit = (row, updateCredit) => {
    // const findById = Object.values(state.subjectGroups).find(x => x.subject_group_id === row.subject_group_id)
    // console.log(findById)
    const cloneState = [...state.subjectGroups]
    Object.values(state.subjectGroups)?.map((x, index) => {
      if (x.subject_group_id === row.subject_group_id) {
        if (row.total_credit[0] === '0' || updateCredit === '0')
          cloneState[index].total_credit = String(row.total_credit).replace(/[0]/gi, '')
        else cloneState[index].total_credit = String(updateCredit)
      }
    })
    // console.log(cloneState)
    setState({ subjectGroups: cloneState })
  }

  function sumTotalCreditsByUniqueValue(data, field) {
    const uniqueValues = new Set()
    const sums = {}

    for (let i = 0; i < data.length; i++) {
      const value = data[i][field]

      if (value) {
        // Add the value to the uniqueValues set only if it's not already present
        if (!uniqueValues.has(value)) {
          uniqueValues.add(value)
          sums[value] = parseInt(data[i].total_credit, 10)
        } else {
          // If the value is already in uniqueValues, update the total_credit
          sums[value] += parseInt(data[i].total_credit, 10)
        }
      }
    }

    // Convert the sums object into an array of objects
    const sumsArray = Array.from(uniqueValues).map(value => ({
      [field]: value,
      sum: sums[value]
    }))

    return sumsArray
  }

  const [sumCreditSJC, setSumCreditSJC] = useState({})
  const [sumCreditSJT, setSumCreditSJT] = useState({})

  // useEffect(() => {
  //   console.log('sumCreditSJC: ', sumCreditSJC)
  //     console.log('sumCreditSJC: ', Object,vasumCreditSJC)
  // }, [sumCreditSJC])

  // useEffect(() => {
  //   console.log('sumCreditSJT: ', sumCreditSJT)
  // }, [sumCreditSJT])

  useEffect(() => {
    setSumCreditSJC(sumTotalCreditsByUniqueValue(state.subjectGroups, 'subject_category_id'))
    setSumCreditSJT(sumTotalCreditsByUniqueValue(state.subjectGroups, 'subject_type_id'))
    // const sumCreditSJC = sumTotalCreditsByUniqueValue(state.subjectGroups, 'subject_category_id')
    // const sumCreditSJT = sumTotalCreditsByUniqueValue(state.subjectGroups, 'subject_type_id')
    // console.log('test function sum SJC: ', Object.values(sumCreditSJC))
    // console.log('test function sum SJT: ', Object.values(sumCreditSJT))
    // setTotalSubjectType(Object.values(sumCreditSJT))

    if (state.subjectGroups.length !== 0) {
      const uniqueSubjectTypes = []
      const subjectTypeSet = new Set()

      const subjectGroups = Object.values(state.subjectGroups)

      for (const subject of subjectGroups) {
        if (!subjectTypeSet.has(subject.subject_type_id)) {
          subjectTypeSet.add(subject.subject_type_id)
          uniqueSubjectTypes.push({
            subject_type_id: subject.subject_type_id,
            subject_type_name: subject.subject_type_name,
            subject_category_id: subject.subject_category_id
          })
        }
      }
      setSubjectTypes(uniqueSubjectTypes)

      const uniqueSubjectCategory = []
      const subjectCategorySet = new Set()

      const subjectCategory = Object.values(state.subjectGroups)

      for (const subject of subjectCategory) {
        if (!subjectCategorySet.has(subject.subject_category_id)) {
          subjectCategorySet.add(subject.subject_category_id)
          uniqueSubjectCategory.push({
            subject_category_id: subject.subject_category_id,
            subject_category_name: subject.subject_category_name
          })
        }
      }
      setSubjectCategory(uniqueSubjectCategory)
      // console.log('get Subject Category ', uniqueSubjectCategory)
    }
    console.log(state.subjectGroups)
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
          <Box
            mr={4}
            mb={2}
            mt={2}
            ml={0}
            display={'flex'}
            justifyContent={'space-between'}
            minWidth={500}
            maxWidth={1000}
          >
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
          <Box my={6} minWidth={500} maxWidth={1000}>
            {Object.values(state.subjectGroups)?.map((sjg, index) => (
              <Box
                mr={4}
                // mt={1}
                // mb={6}
                ml={0}
                display={'flex'}
                justifyContent={'space-between'}
                key={sjg.subject_group_id}
              >
                <Typography sx={{ m: 2 }} variant='body1'>
                  {index + 1} . {' ' + sjg.subject_group_name}
                </Typography>
                <Box display={'flex'} flexDirection={'row'}>
                  <TextField
                    sx={{ width: 80, m: 1 }}
                    size={'small'}
                    fullWidth
                    value={sjg.total_credit}
                    onChange={e => handleChangeTotalCredit(sjg, e.target.value)}
                  />
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
          </Box>
          <Box
            my={6}
            mr={4}
            mb={2}
            mt={2}
            ml={0}
            display={'flex'}
            justifyContent={'space-between'}
            minWidth={500}
            maxWidth={1000}
          >
            <Selection
              firstItemText={'เลือกกลุ่มวิชา'}
              label={'Subject Group'}
              width={200}
              selectionValue={String(subjectGroupSelected) || ''}
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
          <Box mt={6} borderRadius={2} minHeight={800} minWidth={500} maxWidth={1000}>
            <Box display={'flex'} justifyContent={'space-between'}>
              <Typography>Conclusions</Typography>
              <Typography sx={{ mr: 4 }}>Total</Typography>
            </Box>
            <Divider sx={{ mt: 2, mb: 4 }} />

            {Object.values(subjectCategory)?.map(sjc => (
              <Box sx={{ mb: 6 }} key={sjc.subject_category_id}>
                <Box display={'flex'}>
                  <Typography fontWeight={'bold'}>{sjc.subject_category_name} </Typography>
                  {Object.values(sumCreditSJC)?.map(
                    totalSJC =>
                      totalSJC.subject_category_id === sjc.subject_category_id && (
                        <Typography sx={{ mr: 6, fontSize: '14', fontWeight: 'bold' }}>
                          {' (Total ' + totalSJC.sum + ' ' + 'Credit) '}
                        </Typography>
                      )
                  )}
                </Box>
                {Object.values(subjectTypes)?.map(sjt => (
                  <Box sx={{ ml: 6 }} key={sjt.subject_type_id}>
                    {sjc.subject_category_id === sjt.subject_category_id && (
                      <Box mt={1} display={'flex'}>
                        <Typography fontWeight={'bold'}>{sjt.subject_type_name}</Typography>
                        {Object.values(sumCreditSJT)?.map(
                          totalSJT =>
                            totalSJT.subject_type_id === sjt.subject_type_id && (
                              <Typography sx={{ mr: 6, fontSize: '14' }}>
                                {' (Total ' + totalSJT.sum + ' ' + 'Credit) '}
                              </Typography>
                            )
                        )}
                      </Box>
                    )}
                    {state.subjectGroups?.map(
                      sjg =>
                        sjt.subject_type_id === sjg.subject_type_id &&
                        sjc.subject_category_id === sjt.subject_category_id && (
                          <Box
                            mb={-2}
                            key={sjg.subject_group_id}
                            flexDirection={'row'}
                            display={'flex'}
                            justifyContent={'space-between'}
                          >
                            <ListItem>
                              <ListItemIcon>
                                <Box sx={{ m: 0.4, mr: 1.5 }}>
                                  <Icon path={mdiCheckboxBlankCircle} size={0.4} color='primary' />
                                </Box>
                                <Typography>{sjg.subject_group_name}</Typography>
                              </ListItemIcon>
                            </ListItem>
                            <Box textAlign={'right'}>
                              <Typography sx={{ mr: 6, minWidth: 120, color: 'gray' }}>
                                {sjg.total_credit !== '' ? sjg.total_credit + ' Credit' : 'ยังไม่ได้กำหนด'}
                              </Typography>
                            </Box>
                          </Box>
                        )
                    )}
                  </Box>
                ))}
                {state.subjectGroups.length !== 0 && <Divider sx={{ mt: 2, mb: 4 }} />}
              </Box>
            ))}

            {/* ))
            )} */}
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default curriculumstructure
