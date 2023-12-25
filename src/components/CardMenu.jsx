import React from 'react'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Grid'
import Icon from '@mdi/react'

function CardMenu({ handleclick, MenuName, Content, MenuIcon }) {
  return (
    <Card style={{ background: 'transparent' }}>
      <Button onClick={() => handleclick()} sx={{ width: '100%' }}>
        <CardContent
          sx={{
            mx: 8,
            display: 'flex',
            textAlign: 'left', // Align the text to the left
            flexDirection: 'row', // Display icon and text in a row
            alignItems: 'center', // Center the items vertically in the row
            padding: theme => `${theme.spacing(9.75, 5, 9.25)} !important`,
            minWidth: 300
          }}
        >
          <Box sx={{ m: 6 }}>
            <Icon path={MenuIcon} size={2.5} />
          </Box>

          <Box sx={{ width: '100%' }}>
            <Typography variant='body2' fontWeight={'bold'}>
              {MenuName}
            </Typography>
            <Box>{Content}</Box>
          </Box>
        </CardContent>
      </Button>
    </Card>
  )
}

export default CardMenu
