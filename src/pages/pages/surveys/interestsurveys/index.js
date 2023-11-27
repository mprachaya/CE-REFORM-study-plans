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
import { mdiPen, mdiTrashCan } from '@mdi/js'
import { Btn, CircleLoading, Selection } from 'src/components'
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
  const [jobsRelatedType1, setJobsRelatedType1] = useState([])
  const [jobsRelatedType1Temp, setJobsRelatedType1Temp] = useState([]) // type1 for compare when update jobs

  const [answer, setAnswer] = useState([])

  const URL_GET_CURRICULUM = `${url.BASE_URL}/curriculums/`
  const URL_GET_INTEREST_SURVEYS = `${url.BASE_URL}/interest-surveys/`
  const URL_GET_JOBS = `${url.BASE_URL}/job-positions/`
  const URL_PUT_INTEREST_QUESTION = `${url.BASE_URL}/interest-questions/`
  const URL_POST_INTEREST_ANSWER_JOB = `${url.BASE_URL}/interest-answers-jobs/`

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

  const [isDone, setIsDone] = useState(null) // for delay after process

  const handleEditQuestion = (type, object, jobs) => {
    setOpenEdit(true)
    setQuestion(object)
    if (type === 1 && object && jobs) {
      // for edit question type 1 -> point 1-5
      setDialogTitle('Edit Question (Point 1-5)')
      setDialogTextFieldValue(object?.interest_question_title)
      // console.log('jobs', jobs)
      const jobsData = Object.values(jobs)?.map(job => ({
        interest_answers_job_id: job.interest_answer_job_id,
        job_position_id: job.jobPosition.job_position_id,
        job_position_name: job.jobPosition.job_position_name
      }))
      console.log(jobsData)
      setJobsRelatedType1Temp(jobsData)
      setJobsRelatedType1(jobsData)
      // console.log('interest_survey_id :', object?.interest_survey_id)
    } else if (type === 2 && object) {
      setAnswer(object?.interest_answers)
      // for edit  question type 2 -> have choice
      setDialogTitle('Edit Question (Choices)')
      setDialogTextFieldValue(object?.interest_question_title)
      // console.log('interest_question_id :', object?.interest_survey_id)
    }
  }

  const handleUpdateQuestion = (questionLabel, object) => {
    if (questionLabel && object) {
      setIsDone(false)
      axios
        .put(URL_PUT_INTEREST_QUESTION + object?.interest_question_id, {
          interest_survey_id: object?.interest_survey_id,
          interest_question_title: questionLabel,
          interest_question_type: object?.interest_question_type
        })
        .then(res => {
          if (res.data) {
            console.log(res.data)
            reFetchInterestSurveys()
            setIsDone(true)
          }
        })
        .catch(err => console.log(err))
    }
  }

  const handleDeleteQuestion = questionId => {
    if (questionId) {
      let result = window.confirm('Confirm to Delete?')
      if (result) {
        setIsDone(false)
        axios
          .delete(URL_PUT_INTEREST_QUESTION + questionId)
          .then(res => {
            if (res.data) {
              console.log(res.data)
              reFetchInterestSurveys()
              setIsDone(true)
            }
          })
          .catch(err => console.log(err))
      }
    }
  }

  const handleUpdateJobsType1 = () => {
    const newJobs = jobsRelatedType1.filter(
      job => !jobsRelatedType1Temp.find(temp => temp.job_position_id === job.job_position_id)
    )
    const insertNewJobs = () => {
      if (newJobs.length > 0) {
        newJobs.map(job => {
          setIsDone(false)
          const jobState = {
            interest_answer_id: question?.interest_answers[0]?.interest_answer_id,
            job_position_id: job.job_position_id,
            interest_answers_job_score: null
          }
          console.log('jobsState', jobState)
          axios
            .post(URL_POST_INTEREST_ANSWER_JOB, jobState)
            .then(res => {
              if (res.data) {
                console.log(res.data)
                reFetchInterestSurveys()
              }
            })
            .catch(err => console.log(`err from insert job, jobState = ${jobState} with err ${err}`))
            .finally(setIsDone(true))
        })
      }
    }

    const deleteJobs = () => {
      const deleteState = jobsRelatedType1Temp.filter(
        temp => !jobsRelatedType1.find(job => temp.job_position_id === job.job_position_id)
      )
      console.log('deleteState', deleteState)
      if (deleteState.length > 0) {
        setIsDone(false)
        deleteState.map(del => {
          axios
            .delete(URL_POST_INTEREST_ANSWER_JOB + del.interest_answers_job_id)
            .then(res => {
              if (res.data) {
                console.log(res.data)
                reFetchInterestSurveys()
              }
            })
            .catch(err => console.log(`err from delete job, deleteState = ${deleteState} with err ${err}`))
            .finally(setIsDone(true))
        })
      }
    }

    console.log('newJobs', newJobs)
    if (jobsRelatedType1.length > jobsRelatedType1Temp.length) {
      console.log('job have added')
      insertNewJobs()
    } else if (jobsRelatedType1 == jobsRelatedType1Temp) {
      console.log('nothing happened')
    } else if (newJobs.length > 0) {
      console.log('some job have removed and added new job')
      deleteJobs()
      insertNewJobs()
    } else {
      deleteJobs()
      console.log('job have removed')
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
                  width={interestTemp?.length > 0 ? '70%' : '100%'}
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
                {interestTemp?.length !== 0 && (
                  <Selection
                    ml={2}
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
            {interestTemp?.length > 0 && (
              <Grid item xs={12} md={4} lg={3.5}>
                <Btn width={'100%'} handleclick={() => void 0} label={'+ Add New Question'} />
              </Grid>
            )}
            {interestTemp?.length === 0 && (
              <Grid item xs={12} md={4} lg={3.5}>
                <Btn width={'100%'} handleclick={() => void 0} label={'Add New Survey'} />
              </Grid>
            )}
          </Grid>
          <Dialog
            open={!isDone && isDone !== null ? !isDone : false}
            PaperProps={{
              style: {
                backgroundColor: 'transparent',
                boxShadow: 'none'
              }
            }}
          >
            <Typography>
              Processing...
              <CircleLoading />
            </Typography>
          </Dialog>
          {InterestSurveysLoading && interestTemp[0] === undefined ? (
            <Box sx={{ height: 120, m: 12 }}>
              <CircleLoading />
            </Box>
          ) : interestTemp[0] !== undefined ? (
            <Grid container>
              <Grid item xs={12} sx={{ my: 6 }}>
                {interestTemp[0]?.interestQuestions.map((question, qIndex) => (
                  <Card sx={{ m: 2, pl: 3.5, py: 2 }} key={question.interest_question_id}>
                    <Grid container>
                      <Grid container item xs={8} direction={{ xs: 'column', md: 'row' }}>
                        <Grid item>
                          <Typography sx={{ mr: { xs: 0, md: 2 } }}>{qIndex + 1}).</Typography>
                        </Grid>
                        <Grid item>
                          <Typography sx={{ fontSize: { xs: 14, md: 16 }, ml: { xs: 6, md: 0 } }}>
                            {question.interest_question_title}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid container item xs={3.8} direction={'row'} spacing={2.5} justifyContent={'flex-end'}>
                        <Grid item>
                          <Button
                            sx={{ p: 1 }}
                            onClick={() =>
                              handleEditQuestion(
                                question.interest_question_type,
                                question,
                                question.interest_answers[0].interest_answers_job
                              )
                            }
                          >
                            <Icon path={mdiPen} size={0.75} style={{ margin: 0.5 }} />
                            Edit
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            color='error'
                            sx={{ p: 1 }}
                            onClick={() => handleDeleteQuestion(question.interest_question_id)}
                          >
                            <Icon path={mdiTrashCan} size={0.75} style={{ margin: 0.5 }} />
                          </Button>
                        </Grid>
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
                    <Button
                      disabled={!isDone && isDone !== null ? true : false}
                      variant='contained'
                      sx={{ width: '100%', height: '100%' }}
                      onClick={() =>
                        (dialogTextFieldValue !== '') & handleUpdateQuestion(dialogTextFieldValue, question)
                      }
                    >
                      Update Question
                    </Button>
                  </Grid>
                  {question?.interest_question_type === 2 && (
                    <Grid container item xs={12} spacing={2}>
                      <Grid item xs={12}>
                        <Typography>เพิ่มคำตอบ</Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <TextField
                          size={'small'}
                          sx={{ width: '100%' }}
                          label={'New choice'}
                          // value={dialogTextFieldValue || ''}
                          // onChange={e => setDialogTextFieldValue(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <Button
                          disabled={!isDone && isDone !== null ? true : false}
                          variant='outlined'
                          sx={{ width: '100%', height: '100%' }}
                          // onClick={() =>
                          //   (dialogTextFieldValue !== '') & handleUpdateQuestion(dialogTextFieldValue, question)
                          // }
                        >
                          Add New Choice
                        </Button>
                      </Grid>
                    </Grid>
                  )}
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
                        value={jobsRelatedType1}
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
                        options={
                          Jobs.filter(
                            jobFilter =>
                              !jobsRelatedType1.find(job1 => job1.job_position_id === jobFilter.job_position_id)
                          ) || []
                        }
                        getOptionLabel={option => option?.job_position_name}
                        renderInput={params => <TextField {...params} label='Job Positions ' />}
                        onChange={(e, value) => {
                          console.log(value)
                          setJobsRelatedType1(value)
                          console.log(value)
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        disabled={!isDone && isDone !== null ? true : false}
                        variant='contained'
                        sx={{ width: '100%', height: '100%' }}
                        onClick={() => handleUpdateJobsType1()}
                      >
                        Update Jobs
                      </Button>
                    </Grid>
                  </Grid>
                )}
                <Grid container sx={{ m: 2 }} spacing={2}>
                  {question?.interest_question_type === 2 &&
                    question?.interest_answers.map((ans, index) => (
                      <Card key={ans.interest_answer_id} sx={{ width: '100%', p: 2, mb: 3.5 }}>
                        <Grid container sx={{ display: 'flex' }} direction={'row'} item xs={12} spacing={2}>
                          <Grid item xs={12}>
                            <Typography sx={{ p: 2 }}>แก้ไขคำตอบที่ {index + 1}).</Typography>
                          </Grid>

                          <Grid item xs={12}>
                            <TextField
                              size='small'
                              fullWidth
                              value={answer[index]?.interest_answer_title || ''}
                              onChange={e => {
                                // version 1
                                // const findAnswer = answer?.find(a => a.interest_answer_id === ans.interest_answer_id)
                                // const keepAnswer = answer?.filter(a => a.interest_answer_id !== ans.interest_answer_id)
                                // findAnswer.interest_answer_title = e.target.value

                                // setAnswer(() =>
                                //   Array(...keepAnswer)
                                //     .concat(findAnswer)
                                //     .sort((a, b) => a.interest_answer_id - b.interest_answer_id)
                                // )

                                // version 2 chatGPT
                                // const updatedAnswer = answer.map(a =>
                                //   a.interest_answer_id === ans.interest_answer_id
                                //     ? { ...a, interest_answer_title: e.target.value }
                                //     : a
                                // )
                                // setAnswer(updatedAnswer.sort((a, b) => a.interest_answer_id - b.interest_answer_id))

                                // version 3 chatGPT better perfomace
                                const answerObject = answer.reduce((acc, a) => {
                                  acc[a.interest_answer_id] = a
                                  return acc
                                }, {})

                                // Update the answer
                                if (answerObject[ans.interest_answer_id]) {
                                  answerObject[ans.interest_answer_id].interest_answer_title = e.target.value
                                }

                                // Convert the object back to an array and sort it
                                const updatedAnswer = Object.values(answerObject).sort(
                                  (a, b) => a.interest_answer_id - b.interest_answer_id
                                )

                                setAnswer(updatedAnswer)
                              }}
                            />
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
                              onChange={(e, value) => {
                                console.log(value)
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Button
                              disabled={!isDone && isDone !== null ? true : false}
                              variant='contained'
                              sx={{ width: '100%', height: '100%' }}
                            >
                              Update Jobs
                            </Button>
                          </Grid>
                        </Grid>
                      </Card>
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
