import { useState } from 'react';
import { Equipment, EquipmentFormData } from '../types';
import './Modal.css';

interface EquipmentModalProps {
  title: string;
  equipment?: Equipment;
  onSubmit: (data: EquipmentFormData) => Promise<void>;
  onClose: () => void;
}

const equipmentTypes = [
  'Monitor',
  'Laptop',
  'Desktop',
  'Keyboard',
  'Mouse',
  'Printer',
  'Projector',
  'Other',
];

export function EquipmentModal({ title, equipment, onSubmit, onClose }: EquipmentModalProps) {
  const [model, setModel] = useState(equipment?.model || '');
  const [equipmentType, setEquipmentType] = useState(equipment?.equipment_type || equipmentTypes[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!model.trim()) {
      setError('Model is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit({ model: model.trim(), equipment_type: equipmentType });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save equipment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="form-error">{error}</div>}

            <div className="form-group">
              <label htmlFor="model">Model Name</label>
              <input
                id="model"
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g., Dell Elite8, HP LaserJet Pro"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="type">Equipment Type</label>
              <select
                id="type"
                value={equipmentType}
                onChange={(e) => setEquipmentType(e.target.value)}
              >
                {equipmentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {!equipment && (
              <div className="form-note">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
                <span>New equipment will be automatically placed in the Warehouse</span>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="btn-spinner" />
                  Saving...
                </>
              ) : equipment ? (
                'Save Changes'
              ) : (
                'Add Equipment'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

