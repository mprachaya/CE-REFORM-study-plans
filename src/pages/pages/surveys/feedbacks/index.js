import React from 'react'
import { Box, Typography } from '@mui/material'
import { CustomLayout } from 'src/views/custom-layout-surveys'
import BlankLayout from 'src/@core/layouts/BlankLayout'

function feedbacksPage() {
  return <CustomLayout content={<Typography>feedbacks</Typography>} />
}
feedbacksPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default feedbacksPage
