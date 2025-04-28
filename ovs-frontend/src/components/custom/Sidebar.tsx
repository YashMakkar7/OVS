import {
    LayoutDashboard,
    Vote,
    Users,
    BarChart3,
    FileText,
    Settings,
    HelpCircle,
    LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';
import useAdminInfoStore from '../../state_galary/adminInfoModel';
import SidebarItem from './SideBarItems';


const Sidebar = () => {
    const navigate = useNavigate();
    const { name, email, avatar, setAdminInfo } = useAdminInfoStore();
    useEffect(() => {
        const fetchAdminInfo = async () => {
            try {
                const response = await axios.get('http://localhost:3000/info/admin', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const name = response.data.username;
                const avatar = name[0].toUpperCase();
                const email = response.data.email;
                setAdminInfo(name, email, avatar);
            } catch (error) {
                console.error('Error fetching admin info:', error);
            }
        };

        fetchAdminInfo();
    }, [name, email, avatar]);

    function handleLogout() {
        localStorage.removeItem('token');
        navigate('/');
    }

    const navItems = [
        {
            icon: <LayoutDashboard size={20} />,
            label: 'Dashboard',
            path: '/dashboard'
        },
        {
            icon: <Vote size={20} />,
            label: 'Elections',
            path: '/dashboard/elections'
        },
        {
            icon: <Users size={20} />,
            label: 'Voters',
            path: '/dashboard/voters'
        },
        {
            icon: <BarChart3 size={20} />,
            label: 'Analytics',
            path: '/dashboard/analytics'
        },
        {
            icon: <FileText size={20} />,
            label: 'Reports',
            path: '/dashboard/reports'
        },
        {
            icon: <Settings size={20} />,
            label: 'Settings',
            path: '/dashboard/settings'
        },
        {
            icon: <HelpCircle size={20} />,
            label: 'Help & Support',
            path: '/dashboard/support'
        },
    ];

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col">
            {/* Logo and app name */}
            <div className="p-6 border-b">
                <div className="flex items-center space-x-2">
                    <span className="font-bold text-3xl font-mono subpixel-antialiased text-black">elco</span>
                </div>
            </div>

            {/* Navigation items */}
            <nav className="flex-grow py-6">
                <ul className="space-y-1">
                    {navItems.map((item, index) => (
                        <SidebarItem
                            key={index}
                            icon={item.icon}
                            label={item.label}
                            path={item.path}
                            onClick={handleNavigation}
                            isActive={location.pathname === item.path}
                        />
                    ))}
                </ul>
            </nav>

            {/* User profile section */}
            <div className="p-4 border-t">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-lavender flex items-center justify-center text-primaryblue font-medium">
                        {avatar}
                    </div>
                    <div>
                        <p className="font-medium text-sm">{name}</p>
                        <p className="text-xs text-gray-500">{email}</p>
                    </div>
                </div>
            </div>

            {/* Logout button */}
            <div className="border-t">
                <div className="p-4 mx-9">
                    <button
                        onClick={() => handleLogout()}
                        className="flex items-center justify-center w-full py-3 bg-lavender text-primaryblue font-medium rounded-md transition-all duration-200 hover:bg-red-100 hover:text-red-600 hover:shadow-sm"
                    >
                        <LogOut size={18} className="mr-2" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar; 