import { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import useDeleteConfirmationStore from '../../state_galary/DeleteConfirmationStore';

interface DeleteConfirmationDialogProps {
  onConfirm: (id: string) => void;
}

const DeleteConfirmationDialog = ({ onConfirm }: DeleteConfirmationDialogProps) => {
  const { isOpen, electionToDelete, closeDialog } = useDeleteConfirmationStore();
  const deleteButtonRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      // Focus on delete button when dialog opens
      setTimeout(() => {
        deleteButtonRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm"
      onClick={closeDialog}
    >
      <div 
        className="bg-white w-full max-w-md mx-4 rounded-lg shadow-lg overflow-hidden"
        style={{ 
          animation: isOpen ? 'fadeIn 0.3s ease forwards' : 'none'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-primaryblue text-white p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <AlertTriangle size={20} />
            <h3 className="font-medium">Confirm Deletion</h3>
          </div>
          <button onClick={closeDialog} className="text-white hover:text-gray-200">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-gray-600 mb-4">Are you sure you want to delete this election:</p>
          <div className="bg-lavender/10 rounded-md p-3 mb-6">
            <p className="text-charcol font-semibold">{electionToDelete?.title}</p>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              onClick={closeDialog}
            >
              Cancel
            </button>
            <button
              ref={deleteButtonRef}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-primaryblue focus:ring-opacity-100"
              onClick={() => {
                if (electionToDelete) {
                  onConfirm(electionToDelete.id);
                }
                closeDialog();
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationDialog; 