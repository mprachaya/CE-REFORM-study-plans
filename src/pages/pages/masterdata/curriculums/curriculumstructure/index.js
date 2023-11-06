import { Box, Button, Divider, Grid, ListItem, ListItemIcon, MenuItem, TextField, Typography } from '@mui/material'
import Icon from '@mdi/react'
import { mdiCheckboxBlankCircle } from '@mdi/js'
import React, { useEffect, useState } from 'react'
import { CircleLoading, Selection } from 'src/components'
import { url } from 'src/configs/urlConfig'
import { useFetch } from 'src/hooks'
import { useRouter } from 'next/router'

function curriculumstructure() {
  const textSize = 14
  const detailColor = 'gray'
  const URL_GET_SUBJECT_GROUPS = `${url.BASE_URL}/subject-groups/`
  const URL_GET_CURRICULUM = `${url.BASE_URL}/curriculums/`
  const URL_GET_STRUCTURE = `${url.BASE_URL}/curriculum-structures/`
  const initialize = { subjectGroups: [] }

  const router = useRouter()

  const [state, setState] = useState({
    subjectGroups: []
  })
  const [subjectCategory, setSubjectCategory] = useState({
    category: []
  })
  const [subjectTypes, setSubjectTypes] = useState({
    type: []
  })
  const [row, setRow] = useState(undefined)
  const [subjectGroupSelected, setSubjectGroupSelected] = useState(0)

  const {
    error: SubjectGroupsError,
    data: SubjectGroups,
    loading: SubjectGroupsLoading
  } = useFetch(URL_GET_SUBJECT_GROUPS)

  const {
    error: CurriculumError,
    data: Curriculum,
    loading: CurriculumLoading
  } = useFetch(URL_GET_CURRICULUM + router.query.curriculum_id)

  const {
    error: StructureError,
    data: Structure,
    loading: StructureLoading
  } = useFetch(URL_GET_STRUCTURE + router.query.curriculum_id)

  useEffect(() => {
    if (Structure) {
      setState(() => ({ subjectGroups: Structure }))
      console.log(Structure)
    }
  }, [Structure])

  // useEffect(() => {
  //   console.log(state.subjectGroups)
  // }, [state])

  // console.log(SubjectGroups)

  const handleAddSubjectGroups = () => {
    if (row !== undefined) {
      const newObject = {
        subject_category_id: row?.subject_types.subject_category_id,
        subject_category_name: row?.subject_types.subject_categories.subject_category_name,
        subject_type_id: row?.subject_types.subject_type_id,
        subject_type_name: row?.subject_types.subject_type_name,
        subject_group_id: row?.subject_group_id,
        subject_group_name: row?.subject_group_name,
        credit_total: 3
      }
      setState(prevState => ({
        ...prevState,
        subjectGroups: [...prevState.subjectGroups, newObject] // Add the new object to the array
      }))
    } else if (row === undefined) {
      alert('Subject Group already exists or Wrong Selected ')
    }
    setSubjectGroupSelected(0)
  }

  const handleChangeTotalCredit = (row, updateCredit) => {
    // const findById = Object.values(state.subjectGroups).find(x => x.subject_group_id === row.subject_group_id)
    // console.log(findById)
    const regex = /^[0-9\b]+$/
    if (regex.test(updateCredit)) {
      const cloneState = [...state.subjectGroups]
      Object.values(state.subjectGroups)?.map((x, index) => {
        if (x.subject_group_id === row.subject_group_id) {
          if (row.credit_total[0] === '0' || updateCredit === '0')
            cloneState[index].credit_total = String(row.credit_total).replace(/[0]/gi, '')
          else cloneState[index].credit_total = String(updateCredit)
        }
      })
      // console.log(cloneState)
      setState({ subjectGroups: cloneState })
    } else if (updateCredit === '') {
      const cloneState = [...state.subjectGroups]
      Object.values(state.subjectGroups)?.map((x, index) => {
        if (x.subject_group_id === row.subject_group_id) {
          cloneState[index].credit_total = String(1)
        }
      })
      // console.log(cloneState)
      setState({ subjectGroups: cloneState })
    }
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
          sums[value] = parseInt(data[i].credit_total, 10)
        } else {
          // If the value is already in uniqueValues, update the credit_total
          sums[value] += parseInt(data[i].credit_total, 10)
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
    // console.log(state.subjectGroups)
    // console.log(subjectCategory)
    console.log(state)
  }, [state])

  const CurriculumDetails = () => (
    <Grid container mt={6} spacing={2}>
      <Grid item xs={3}>
        <Typography fontSize={textSize}>Name(TH) :</Typography>
      </Grid>
      <Grid item xs={9}>
        <Typography color={detailColor} fontSize={textSize}>
          {Curriculum?.curriculum_short_name_th}
        </Typography>
      </Grid>
      <Grid item xs={3}>
        <Typography fontSize={textSize}>Name(EN) :</Typography>
      </Grid>
      <Grid item xs={9}>
        <Typography color={detailColor} fontSize={textSize}>
          {Curriculum?.curriculum_short_name_en}
        </Typography>
      </Grid>
      <Grid item xs={3}>
        <Typography fontSize={textSize}>Faculty:</Typography>
      </Grid>
      <Grid item xs={9}>
        <Typography color={detailColor} fontSize={textSize}>
          {Curriculum.faculty?.faculty_name_th}
        </Typography>
      </Grid>

      <Grid item xs={3}>
        <Typography fontSize={textSize}>Curriculum Year:</Typography>
      </Grid>
      <Grid item xs={9}>
        <Typography color={detailColor} fontSize={textSize}>
          {Curriculum?.curriculum_year}
        </Typography>
      </Grid>
    </Grid>
  )

  if (SubjectGroupsLoading && CurriculumLoading && StructureLoading) {
    return <CircleLoading />
  }
  if (SubjectGroupsError && CurriculumError && StructureError) {
    return <Box>Error Fetching...</Box>
  }

  return router.query.curriculum_id ? (
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
            <Typography sx={{ m: 2 }}>Subject Group</Typography>

            <Box display={'flex'} justifyContent={'space-between'}>
              <Typography sx={{ m: 2 }}>Total Credit</Typography>
            </Box>
          </Box>
          <Divider sx={{ mt: 2, mb: 4 }} />
          <Box my={6} minWidth={500} maxWidth={1000}>
            {Object.values(state.subjectGroups)?.map((sjg, index) => (
              <Box mr={4} ml={0} display={'flex'} justifyContent={'space-between'} key={sjg.subject_group_id}>
                <Typography sx={{ m: 2 }} variant='body1'>
                  {index + 1} . {' ' + sjg.subject_group_name}
                </Typography>
                <Box display={'flex'} flexDirection={'row'}>
                  <TextField
                    sx={{ width: 80, m: 1 }}
                    size={'small'}
                    type='number'
                    fullWidth
                    value={sjg.credit_total}
                    onChange={e => {
                      handleChangeTotalCredit(sjg, e.target.value)
                    }}
                  />
                  <Button
                    variant={'text'}
                    sx={{ px: 2 }}
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
                      setRow(undefined)
                    }
                    console.log(sjg)
                    // console.log('check', checkUniqId)
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
                        <Typography
                          sx={{ mr: 6, fontSize: '14', fontWeight: 'bold' }}
                          key={sumCreditSJC.subject_category_id}
                        >
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
                              <Typography sx={{ mr: 6, fontSize: '14' }} key={totalSJT.subject_type_id}>
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
                                {sjg.credit_total !== '' ? sjg.credit_total + ' Credit' : 'ยังไม่ได้กำหนด'}
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
  ) : (
    <Box sx={{ m: 12 }}> curriculum is undefined</Box>
  )
}

export default curriculumstructure
