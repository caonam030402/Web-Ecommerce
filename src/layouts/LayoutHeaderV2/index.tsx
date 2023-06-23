import Footer from 'src/components/Footer'
import HeaderMobile from 'src/components/HeaderMobile'
import HeaderV2 from 'src/components/HeaderV2'

interface Props {
  searchBar?: boolean
  namePage?: string
  children?: React.ReactNode
}

export default function LayoutHeaderV2({ children, namePage, searchBar }: Props) {
  return (
    <div>
      <HeaderMobile namePage={namePage} />
      <HeaderV2 namePage={namePage} searchBar={searchBar} />
      {children}
      <Footer />
    </div>
  )
}
