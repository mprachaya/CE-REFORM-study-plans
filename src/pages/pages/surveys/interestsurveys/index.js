import React from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { Typography } from '@mui/material'
import { CustomLayout } from 'src/views/custom-layout-surveys'

function interestsurveysPage() {
  return <CustomLayout content={<Typography>interest surveys</Typography>} />
}
interestsurveysPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default interestsurveysPage
