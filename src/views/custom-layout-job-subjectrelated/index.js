import React from 'react'
import { useSettings } from 'src/@core/hooks/useSettings'
import VerticalLayout from 'src/@core/layouts/VerticalLayout'
import VerticalAppBarContent from 'src/layouts/components/vertical/AppBarContent'
import useMediaQuery from '@mui/material/useMediaQuery'
import { jobSubjectRelatedNavigation } from 'src/navigation/vertical'

export const CustomLayout = ({ content }) => {
  const { settings, saveSettings } = useSettings()
  const hidden = useMediaQuery(theme => theme.breakpoints.down('lg'))
  return (
    <VerticalLayout
      hidden={hidden}
      settings={settings}
      saveSettings={saveSettings}
      verticalNavItems={jobSubjectRelatedNavigation()} // Navigation Items
      // afterVerticalNavMenuContent={UpgradeToProImg}
      verticalAppBarContent={(
        props // AppBar Content
      ) => (
        <VerticalAppBarContent
          hidden={hidden}
          settings={settings}
          saveSettings={saveSettings}
          toggleNavVisibility={props.toggleNavVisibility}
        />
      )}
    >
      {content}
      {/* <UpgradeToProButton /> */}
    </VerticalLayout>
  )
}
