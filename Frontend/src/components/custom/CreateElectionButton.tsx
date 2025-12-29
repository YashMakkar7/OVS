import { PlusIcon } from 'lucide-react';
import useCreateElectionStore from '../../state_galary/CreateElectionStore';
import { useState, useEffect } from 'react';

const CreateElectionButton = () => {
  const { toggleModal } = useCreateElectionStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in on component mount
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <button
      onClick={() => {
        toggleModal();
        // Add click animation
        setIsHovered(true);
        setTimeout(() => setIsHovered(false), 300);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed right-8 bottom-8 flex items-center justify-center w-14 h-14 rounded-full 
        bg-primaryblue text-white shadow-lg transition-all duration-300 
        ${isHovered ? 'scale-110 bg-blue-600 shadow-xl' : 'scale-100'}
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}
        hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50`}
      aria-label="Create new election"
    >
      <PlusIcon 
        size={24} 
        className={`transition-transform duration-300 ${isHovered ? 'rotate-90' : 'rotate-0'}`} 
      />
    </button>
  );
};

export default CreateElectionButton; 