import React from 'react';

// Define an interface for the component's props
interface CallLimitPopupProps {
  show: boolean;
  onClose: () => void;
}

// Add the interface to the component's function signature
function CallLimitPopup({ show, onClose }: CallLimitPopupProps) {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-xl font-bold mb-4">Call Limit Reached</h2>
        <p className="text-gray-700">
          You have reached the maximum number of 9 calls for this development phase.
          Please try again later.
        </p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default CallLimitPopup;