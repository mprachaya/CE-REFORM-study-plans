import React, { useEffect, useState } from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import {
  Typography,
  Grid,
  Box,
  Hidden,
  MenuItem,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Card
} from '@mui/material'

import { CustomLayout } from 'src/views/custom-layout-surveys'
import { mdiPen } from '@mdi/js'
import { Btn, Selection } from 'src/components'
import Icon from '@mdi/react'
import { url } from 'src/configs/urlConfig'
import { useFetch } from 'src/hooks'
import axios from 'axios'

function interestsurveysPage() {
  const [curriculumSelected, setCurriculumSelected] = useState(0)
  const [interestVersionSelected, setInterestVersionSelected] = useState(0)

  const [openEdit, setOpenEdit] = useState(false)
  const [dialogTitle, setDialogTitle] = useState('')
  const [dialogTextFieldValue, setDialogTextFieldValue] = useState('')

  const URL_GET_CURRICULUM = `${url.BASE_URL}/curriculums/`
  const URL_GET_INTEREST_SURVEYS = `${url.BASE_URL}/interest-surveys/`
  const URL_PUT_INTEREST_QUESTION = `${url.BASE_URL}/interest-questions/`
  const URL_PUT_INTEREST_ANSWER = `${url.BASE_URL}/interest-answers/`

  const {
    error: CurriculumError,
    data: Curriculums,
    setData: setCurriculums,
    loading: CurriculumLoading,
    reFetch: reFetchCurriculums
  } = useFetch(URL_GET_CURRICULUM)

  const {
    error: InterestSurveysError,
    data: InterestSurveys,
    setData: setInterestSurveys,
    loading: InterestSurveysLoading,
    reFetch: reFetchInterestSurveys
  } = useFetch(URL_GET_INTEREST_SURVEYS + curriculumSelected)

  const handleEdit = (type, object) => {
    setOpenEdit(true)
    if (type === 1 && object) {
      // for edit question
      setDialogTitle('Edit Question')
      setDialogTextFieldValue(object?.interest_question_title)
      console.log('interest_survey_id :', object?.interest_survey_id)
    } else if (type === 2 && object) {
      // for edit answer
      setDialogTitle('Edit Answer')
      setDialogTextFieldValue(object?.interest_answer_title)
      console.log('interest_question_id :', object?.interest_question_id)
    }
  }
  const handleUpdate = (type, object, text) => {
    if (type === 1 && object && text !== '') {
      // for edit question
      axios
        .put(URL_PUT_INTEREST_QUESTION + object?.interest_question_id, {
          interest_survey_id: object?.interest_survey_id,
          interest_question_title: text,
          interest_question_number: object?.interest_question_number
        })
        .then(res => res.data && console.log(res.data))
        .catch(err => console.log(err))
    } else if (type === 2 && object && text !== '') {
      axios
        .put(URL_PUT_INTEREST_ANSWER + object?.interest_answer_id, {
          interest_question_id: object?.interest_question_id,
          interest_answer_choice: text,
          interest_answer_number: object?.interest_answer_number
        })
        .then(res => res.data && console.log(res.data))
        .catch(err => console.log(err))
      // for edit answer
    }
  }

  useEffect(() => {
    if (InterestSurveys) console.log(InterestSurveys)
  }, [InterestSurveys])

  useEffect(() => {
    if (Curriculums.length > 0) {
      const findMaxId = Curriculums?.reduce(
        (max, current) => (current.curriculum_id > max.curriculum_id ? current : max),
        Curriculums[0]
      )
      // console.log(findMaxId)
      setCurriculumSelected(findMaxId.curriculum_id)
    }
  }, [Curriculums])
  useEffect(() => {
    if (InterestSurveys.length > 0) {
      const findMaxId = InterestSurveys?.reduce(
        (max, current) => (current.interest_survey_version > max.interest_survey_version ? current : max),
        InterestSurveys[0]
      )
      // console.log(findMaxId)
      setInterestVersionSelected(findMaxId.interest_survey_version)
    } else {
      setInterestVersionSelected(0)
    }
  }, [InterestSurveys])

  return (
    <CustomLayout
      content={
        <>
          <Typography variant='h6'>Interest Surveys</Typography>
          <Grid container spacing={6} sx={{ mt: 5 }}>
            <Grid item xs={12} md={8} lg={8}>
              <Box display={'flex'} flexDirection={'row'}>
                <Selection
                  label={'Curriculum'}
                  height={40}
                  width={InterestSurveys.length > 0 ? '70%' : '100%'}
                  selectionValue={curriculumSelected}
                  handleChange={e => setCurriculumSelected(e.target.value)}
                  Items={Object.values(Curriculums)
                    ?.sort((a, b) => b.curriculum_id - a.curriculum_id)
                    .map(curri => (
                      <MenuItem key={curri.curriculum_id} value={curri.curriculum_id}>
                        {curri.curriculum_name_th + ' ' + curri.curriculum_year}
                      </MenuItem>
                    ))}
                />
                {InterestSurveys.length !== 0 && (
                  <Selection
                    label={'Version'}
                    height={40}
                    width={'30%'}
                    selectionValue={interestVersionSelected}
                    handleChange={e => setInterestVersionSelected(e.target.value)}
                    Items={Object.values(InterestSurveys)?.map(inter => (
                      <MenuItem key={inter.interest_survey_version} value={inter.interest_survey_version}>
                        Version:{inter.interest_survey_version}
                      </MenuItem>
                    ))}
                  />
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={4} lg={2}>
              <Btn width={'100%'} handleclick={() => void 0} label={'+ Add New'} />
            </Grid>
          </Grid>

          {InterestSurveys[0] !== undefined ? (
            <Grid container>
              <Grid item xs={12} sx={{ my: 6 }}>
                {InterestSurveys[0]?.interestQuestions.map((question, qIndex) => (
                  <Card sx={{ m: 2, pl: 3.5, py: 2 }} key={question.interest_question_id}>
                    <Grid container>
                      <Grid container item xs={10} md={11} direction={{ xs: 'column', md: 'row' }}>
                        <Grid item>
                          <Typography sx={{ mr: 2 }}>{qIndex + 1}).</Typography>
                        </Grid>
                        <Grid item>
                          <Typography sx={{ fontSize: { xs: 14, md: 16 }, ml: { xs: 6, md: 0 } }}>
                            {question.interest_question_title}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid item xs={2} md={1}>
                        <Button sx={{ ml: 2, p: { xs: 0, md: 0.5 } }} onClick={() => handleEdit(1, question)}>
                          <Icon path={mdiPen} size={0.75} style={{ margin: 0.5 }} />
                          Edit
                        </Button>
                      </Grid>
                    </Grid>
                    <Box sx={{ ml: 4, my: 1 }}>
                      {question?.interest_answers.map((ans, ansIndex) => (
                        <Grid container key={ans.interest_answer_id}>
                          {question?.interest_question_type == 1 ? (
                            <Grid item xs={10}>
                              <Typography variant='body2' sx={{ ml: 2 }}>
                                ตอบแบบให้คะแนน 1-5 (น้อย - มาก)
                              </Typography>
                            </Grid>
                          ) : (
                            <Grid container item xs={10} direction={'row'}>
                              <Grid item>
                                <Typography variant='body2' sx={{ mr: 1 }}>
                                  {ansIndex + 1}).
                                </Typography>
                              </Grid>
                              <Grid item>
                                <Typography variant='body2'>{ans.interest_answer_title}</Typography>
                              </Grid>
                            </Grid>
                          )}
                        </Grid>
                      ))}
                    </Box>

                    <Divider />
                  </Card>
                ))}
              </Grid>
            </Grid>
          ) : (
            <Typography sx={{ m: 6 }}>have not interest surveys</Typography>
          )}
          <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth={'md'} fullWidth>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ my: 2 }}>
                <Grid item xs={8}>
                  <TextField
                    sx={{ width: '100%' }}
                    label={'Label'}
                    value={dialogTextFieldValue || ''}
                    onChange={e => setDialogTextFieldValue(e.target.value)}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Button variant='contained' sx={{ width: '100%', height: '100%' }}>
                    Update
                  </Button>
                </Grid>
              </Grid>
            </DialogContent>
          </Dialog>
        </>
      }
    />
  )
}
interestsurveysPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default interestsurveysPage
