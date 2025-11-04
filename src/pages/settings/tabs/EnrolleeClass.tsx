import React from 'react';

const EnrolleeClass: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Enrollee Class Management</h2>
      
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-600">Manage different enrollee types and their configurations.</p>
        </div>
        <div className="flex justify-end">
          <button className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnrolleeClass;