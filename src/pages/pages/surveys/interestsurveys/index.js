import React, { useEffect, useState } from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { Typography, Grid, Box, Hidden, MenuItem } from '@mui/material'
import { CustomLayout } from 'src/views/custom-layout-surveys'
import { mdiFilter } from '@mdi/js'
import { Btn, Selection } from 'src/components'
import Icon from '@mdi/react'
import { url } from 'src/configs/urlConfig'
import { useFetch } from 'src/hooks'

function interestsurveysPage() {
  const [curriculumSelected, setCurriculumSelected] = useState(0)
  const [interestVersionSelected, setInterestVersionSelected] = useState(0)

  const URL_GET_CURRICULUM = `${url.BASE_URL}/curriculums/`
  const URL_GET_INTEREST_SURVEYS = `${url.BASE_URL}/interest-surveys/`

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
                <Hidden only={'xs'}>
                  <Box sx={{ m: 2 }}>
                    <Icon path={mdiFilter} size={1} />
                  </Box>
                </Hidden>
                <Selection
                  label={'Curriculum'}
                  height={40}
                  width={InterestSurveys.length > 0 ? '70%' : '100%'}
                  selectionValue={curriculumSelected}
                  handleChange={e => setCurriculumSelected(e.target.value)}
                  Items={Object.values(Curriculums)?.map(curri => (
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
          {InterestSurveys.length > 0 ? (
            <Typography sx={{ m: 6 }}>have interest surveys</Typography>
          ) : (
            <Typography sx={{ m: 6 }}>have not interest surveys</Typography>
          )}
        </>
      }
    />
  )
}
interestsurveysPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default interestsurveysPage
