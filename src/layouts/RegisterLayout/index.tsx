import Footer from 'src/components/Footer'
import RegisterHeader from 'src/components/RegisterHeader'

interface Props {
  children?: React.ReactNode
}

export default function RegisterLayout({ children }: Props) {
  return (
    <div className='m-auto lg:px-0'>
      <RegisterHeader />
      {children}
      <Footer />
    </div>
  )
}
