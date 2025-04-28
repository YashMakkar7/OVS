// SidebarItem component for individual navigation items
type SidebarItemProps = {
    icon: React.ReactNode;
    label: string;
    path: string;
    onClick: (path: string) => void;
    isActive?: boolean;
};

const SidebarItem = ({ icon, label, path, onClick, isActive = false }: SidebarItemProps) => {
    return (
        <li>
            <button
                onClick={() => onClick(path)}
                className={`flex items-center w-full px-6 py-2.5 text-sm ${
                    isActive
                        ? 'bg-lavender text-primaryblue font-medium'
                        : 'text-charcol hover:bg-coolgray'
                }`}
            >
                <span className="mr-3">{icon}</span>
                {label}
            </button>
        </li>
    );
};

export default SidebarItem;