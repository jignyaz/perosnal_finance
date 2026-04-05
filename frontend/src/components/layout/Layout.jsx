import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import ToastContainer from './ToastContainer';

const Layout = () => {
    return (
        <div className="flex h-screen overflow-hidden selection:bg-accent/30 selection:text-white">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 h-full">
                <Header />
                <main className="flex-1 p-6 lg:p-8 overflow-auto custom-scrollbar">
                    <div className="max-w-[1600px] mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Layout;
