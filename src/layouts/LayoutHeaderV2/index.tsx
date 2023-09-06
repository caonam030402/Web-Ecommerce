import Footer from 'src/components/Footer'
import HeaderMobile from 'src/components/HeaderMobile'
import HeaderV2 from 'src/components/HeaderV2'

interface Props {
  searchBar?: boolean
  namePage?: string
  nameImagePage?: string
  children?: React.ReactNode
  classNameHeaderMobile?: string
}

export default function LayoutHeaderV2({ children, namePage, searchBar, nameImagePage, classNameHeaderMobile }: Props) {
  return (
    <div>
      <HeaderMobile namePage={namePage} nameImagePage={nameImagePage} classNameHeaderMobile={classNameHeaderMobile} />
      <HeaderV2 namePage={namePage} searchBar={searchBar} />
      {children}
      <Footer />
    </div>
  )
}
