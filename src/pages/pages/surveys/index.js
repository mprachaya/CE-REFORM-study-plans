import React from 'react'
import Box from '@mui/material/Box'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

function SurveysPage() {
  const router = useRouter()
  useEffect(() => {
    router.push('/pages/surveys/curriculums')
  }, [])
}

export default SurveysPage
