import React from 'react';
import type { Authorization } from '../../types/authorization';

interface AuthorizationDetailsModalProps {
  open: boolean;
  onClose: () => void;
  authorization: Authorization | null;
}

export const AuthorizationDetailsModal: React.FC<AuthorizationDetailsModalProps> = ({
  open,
  onClose,
  authorization,
}) => {
  if (!open || !authorization) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Authorization Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">Authorization Number:</label>
            <p>{authorization.authorizationNumber}</p>
          </div>
          <div>
            <label className="font-semibold">Status:</label>
            <p>{authorization.authorizationStatus}</p>
          </div>
          <div>
            <label className="font-semibold">Enrollee Name:</label>
            <p>{authorization.enrolleeName}</p>
          </div>
          <div>
            <label className="font-semibold">Enrollee ID:</label>
            <p>{authorization.enrolleeIdNumber}</p>
          </div>
          <div>
            <label className="font-semibold">Diagnosis:</label>
            <p>{authorization.diagnosis}</p>
          </div>
          <div>
            <label className="font-semibold">Request Date:</label>
            <p>{new Date(authorization.requestDate).toLocaleDateString()}</p>
          </div>
          <div className="col-span-2">
            <label className="font-semibold">Request Source:</label>
            <p>{authorization.requestSource}</p>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthorizationDetailsModal;