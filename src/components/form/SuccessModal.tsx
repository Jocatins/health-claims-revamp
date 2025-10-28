import React from "react";
import { FaX } from "react-icons/fa6";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}

const SuccessModal: React.FC<ModalProps> = ({ isOpen, onClose, title, message, icon }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-6 relative text-center animate-fade-in">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <FaX size={20} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          {icon || (
            <div className="h-14 w-14 rounded-full flex items-center justify-center border border-[#DC2626]-700 bg-[#DC2626]-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="[#DC2626]"
                className="h-8 w-8"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>

        {/* Title */}
        {title && <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>}

        {/* Message */}
        {message && <p className="text-gray-600">{message}</p>}
      </div>
    </div>
  );
};

export default SuccessModal;
