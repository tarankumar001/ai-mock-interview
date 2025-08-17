import { Header } from '@/components/header'
import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <Container className="flex flex-col flex-grow">
        <main className='flex-grow'>
          <Outlet />
        </main>
      </Container>
      <Footer />
    </div>
  )
}

export default MainLayout
