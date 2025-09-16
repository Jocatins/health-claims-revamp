import React from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  width?: string;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children, title, width }) => {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: width || '400px' }}>
        <div className="modal-header border-b border-gray-200">
          {title && <h2 className='font-avenir font-extrabold text-[24px] leading-8 tracking-tightpx m-0'>{title}</h2>}
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.12);
          padding: 24px;
          position: relative;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          border-bottom: 1px solid #217346;
          padding-bottom: 16px;
        }
        .modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
        }
        .modal-body {
          min-width: 300px;
        }
      `}</style>
    </div>
  );
};

export default Modal;
