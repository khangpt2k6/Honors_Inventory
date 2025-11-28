import { useState } from 'react';
import { Equipment } from '../types';
import './Modal.css';

interface DeleteConfirmModalProps {
  equipment: Equipment;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

export function DeleteConfirmModal({ equipment, onConfirm, onClose }: DeleteConfirmModalProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-danger" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Delete Equipment</h2>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="delete-warning">
            <div className="warning-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <path d="M12 9v4M12 17h.01" />
              </svg>
            </div>
            <p>Are you sure you want to delete this equipment?</p>
          </div>

          <div className="delete-equipment-info">
            <div className="info-row">
              <span className="info-label">Model:</span>
              <span className="info-value">{equipment.model}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Type:</span>
              <span className="info-value">{equipment.equipment_type}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Location:</span>
              <span className="info-value">{equipment.room_name}</span>
            </div>
          </div>

          <p className="delete-note">This action cannot be undone.</p>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="btn-spinner" />
                Deleting...
              </>
            ) : (
              'Delete Equipment'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

