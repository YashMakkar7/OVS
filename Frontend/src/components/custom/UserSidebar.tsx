import {
    LayoutDashboard,
    Vote,
    BarChart3,
    LogOut
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useEffect , useState} from 'react';
import useUserInfoStore from '../../state_galary/userInfoModel';
import SidebarItem from './SideBarItems';


const UserSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [id,setId] = useState("")
    const { name, email, avatar, adharId, setUserInfo } = useUserInfoStore();
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get('http://localhost:3000/info/user', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const id = response.data.userId;
                setId(id)
                const name = response.data.username || '';
                const avatar = name && name.length > 0 ? name[0].toUpperCase() : '';
                const email = response.data.email || '';
                // Accept either spelling
                const adharId = response.data.adharId || response.data.aadharId || '';
                
                setUserInfo(name, email, adharId, avatar);
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        fetchUserInfo();
    }, [setUserInfo]);

    function handleLogout() {
        localStorage.clear();
        navigate('/');
    }

    const navItems = [
        {
            icon: <LayoutDashboard size={20} />,
            label: 'Dashboard',
            path: `/dashboard/${id}`
        },
        {
            icon: <Vote size={20} />,
            label: 'Vote',
            path: '/vote'
        },
        {
            icon: <BarChart3 size={20} />,
            label: 'Results',
            path: '/result'
        }
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
                    <div className="overflow-hidden">
                        <p className="font-medium font-bold text-sm truncate">{name}</p>
                        <p className="text-xs leading-tight break-words max-w-[150px]">
                            AdharID: {adharId ? adharId : "Not available"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{email}</p>
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

export default UserSidebar; 