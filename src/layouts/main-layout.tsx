import { Header } from '@/components/header'
import { Container } from '@/components/container'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div className='flex flex-col h-screen'>
      <Header />
      <Container className="flex flex-col h-screen">
        <main className='flex-grow'>
          <Outlet />
        </main>
      </Container>
    </div>
  )
}

export default MainLayout
