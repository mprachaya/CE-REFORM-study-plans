import React, { useEffect, useState } from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import {
  Typography,
  Grid,
  Box,
  Autocomplete,
  MenuItem,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Chip,
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
  const [interestTemp, setInterestTemp] = useState([])

  const [openEdit, setOpenEdit] = useState(false)
  const [dialogTitle, setDialogTitle] = useState('')
  const [dialogTextFieldValue, setDialogTextFieldValue] = useState('')
  const [question, setQuestion] = useState([])

  const URL_GET_CURRICULUM = `${url.BASE_URL}/curriculums/`
  const URL_GET_INTEREST_SURVEYS = `${url.BASE_URL}/interest-surveys/`
  const URL_GET_JOBS = `${url.BASE_URL}/job-positions/`
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

  const {
    error: JobsError,
    data: Jobs,
    setData: setJobs,
    loading: JobsLoading,
    reFetch: reFetchJobs
  } = useFetch(URL_GET_JOBS)

  const handleEditQuestion = (type, object) => {
    setOpenEdit(true)
    setQuestion(object)
    if (type === 1 && object) {
      // for edit question type 1 -> point 1-5
      setDialogTitle('Edit Question (Point 1-5)')
      setDialogTextFieldValue(object?.interest_question_title)
      // console.log('interest_survey_id :', object?.interest_survey_id)
    } else if (type === 2 && object) {
      // for edit  question type 2 -> have choice
      setDialogTitle('Edit Question (Choices)')
      setDialogTextFieldValue(object?.interest_question_title)
      // console.log('interest_question_id :', object?.interest_survey_id)
    }
  }
  // const handleUpdate = (type, object, text) => {
  //   if (type === 1 && object && text !== '') {
  //     // for edit question
  //     axios
  //       .put(URL_PUT_INTEREST_QUESTION + object?.interest_question_id, {
  //         interest_survey_id: object?.interest_survey_id,
  //         interest_question_title: text,
  //         interest_question_number: object?.interest_question_number
  //       })
  //       .then(res => res.data && console.log(res.data))
  //       .catch(err => console.log(err))
  //   } else if (type === 2 && object && text !== '') {
  //     axios
  //       .put(URL_PUT_INTEREST_ANSWER + object?.interest_answer_id, {
  //         interest_question_id: object?.interest_question_id,
  //         interest_answer_choice: text,
  //         interest_answer_number: object?.interest_answer_number
  //       })
  //       .then(res => res.data && console.log(res.data))
  //       .catch(err => console.log(err))
  //     // for edit answer
  //   }
  // }

  useEffect(() => {
    if (curriculumSelected) {
      reFetchInterestSurveys()
    }
  }, [curriculumSelected])

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
      setInterestTemp(InterestSurveys)
    } else {
      setInterestVersionSelected(0)
      setInterestTemp([])
    }
    console.log(InterestSurveys)
  }, [InterestSurveys])

  useEffect(() => {
    if (InterestSurveysError) {
      setInterestTemp([])
    }
  }, [InterestSurveysError])

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

          {interestTemp[0] !== undefined ? (
            <Grid container>
              <Grid item xs={12} sx={{ my: 6 }}>
                {interestTemp[0]?.interestQuestions.map((question, qIndex) => (
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
                        <Button
                          sx={{ mx: 1.5, p: { xs: 0, md: 0.5 } }}
                          onClick={() => handleEditQuestion(question.interest_question_type, question)}
                        >
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
            <DialogContent sx={{ pb: 12, minHeight: 500 }}>
              <Grid container sx={{ my: 2 }}>
                <Grid container spacing={2} sx={{ m: 2, mt: 0 }}>
                  <Grid item xs={12}>
                    <Typography>แก้ไขคำถาม</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      size={'small'}
                      sx={{ width: '100%' }}
                      label={'Question'}
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
                {question?.interest_question_type === 1 && (
                  <Grid container spacing={2} sx={{ m: 2 }}>
                    <Grid item xs={12}>
                      <Typography>เกี่ยวข้องกับอาชีพ (Jobs Related)</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Autocomplete
                        size='small'
                        // key={clearAutoComplete} // if toggle will clear value of autocomplete
                        disablePortal
                        fullWidth
                        multiple
                        freeSolo
                        renderTags={(value, getTagProps) =>
                          value.map(option => (
                            <Chip
                              sx={{ m: 0, p: 0 }}
                              key={option?.job_position_id}
                              variant='outlined'
                              label={option?.job_position_name}
                              {...getTagProps(option?.job_position_id)}
                            />
                          ))
                        }
                        // options={Jobs?.filter(sj => sj.subject_id !== subject.subject_id)}
                        options={Jobs || []}
                        getOptionLabel={option => option?.job_position_name}
                        renderInput={params => <TextField {...params} label='Job Positions ' />}
                        // onChange={(e, value) => {
                        //   setSubjectSelected(value)
                        // }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button variant='contained' sx={{ width: '100%', height: '100%' }}>
                        Update
                      </Button>
                    </Grid>
                  </Grid>
                )}

                <Grid container sx={{ m: 2 }} spacing={2}>
                  {question?.interest_question_type === 2 &&
                    question?.interest_answers.map((ans, index) => (
                      <Grid
                        container
                        sx={{ display: 'flex' }}
                        direction={'row'}
                        item
                        xs={12}
                        key={ans.interest_answer_id}
                        spacing={2}
                      >
                        <Grid item xs={12}>
                          <Typography sx={{ p: 2 }}>แก้ไขคำตอบที่ {index + 1}).</Typography>
                        </Grid>

                        <Grid item xs={12}>
                          <TextField size='small' fullWidth value={ans.interest_answer_title} />
                        </Grid>
                        <Grid item xs={12}>
                          <Autocomplete
                            size='small'
                            // key={clearAutoComplete} // if toggle will clear value of autocomplete
                            disablePortal
                            fullWidth
                            multiple
                            freeSolo
                            renderTags={(value, getTagProps) =>
                              value.map(option => (
                                <Chip
                                  sx={{ m: 0, p: 0 }}
                                  key={option?.job_position_id}
                                  variant='outlined'
                                  label={option?.job_position_name}
                                  {...getTagProps(option?.job_position_id)}
                                />
                              ))
                            }
                            // options={Jobs?.filter(sj => sj.subject_id !== subject.subject_id)}
                            options={Jobs || []}
                            getOptionLabel={option => option?.job_position_name}
                            renderInput={params => <TextField {...params} label='Jobs Related ' />}
                            // onChange={(e, value) => {
                            //   setSubjectSelected(value)
                            // }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Button variant='contained' sx={{ width: '100%', height: '100%' }}>
                            Update
                          </Button>
                        </Grid>
                      </Grid>
                    ))}
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
