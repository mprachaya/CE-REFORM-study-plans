import React from 'react'
import Box from '@mui/material/Box'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

function MasterDataPage() {
  const router = useRouter()
  useEffect(() => {
    router.push('/pages/masterdata/curriculums')
  }, [])

  return <Box className='content-center'>index</Box>
}

export default MasterDataPage
