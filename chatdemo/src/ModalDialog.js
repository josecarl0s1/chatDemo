import React, { useState } from 'react';

function ModalDialog({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <button onClick={() => setIsOpen(false)}>Close</button>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

export default ModalDialog;
