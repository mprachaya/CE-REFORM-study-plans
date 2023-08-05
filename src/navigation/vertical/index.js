import BookOutline from 'mdi-material-ui/BookOutline'
import Domain from 'mdi-material-ui/Domain'

const navigation = () => {
  return [
    {
      sectionTitle: 'MasterData'
    },
    {
      title: 'Curriculums',
      icon: BookOutline,
      path: '/pages/masterdata/curriculums'
    },
    {
      title: 'Faculty',
      icon: Domain,
      path: '/pages/masterdata/faculty'
      // openInNewTab: true
    }
  ]
}

export default navigation
