import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

const Layout = () => {
    return (
        <div className="flex min-h-screen bg-[var(--color-bg-base)]">
            <Sidebar />
            <main className="flex-1 min-h-screen p-4 lg:p-12 transition-all duration-300 ease-out w-full max-w-[calc(100vw-260px)]">
                <Outlet />
            </main>
        </div>
    )
}

export default Layout
