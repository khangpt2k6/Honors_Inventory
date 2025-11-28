import { useState } from 'react';
import { Equipment, Location } from '../types';
import './Modal.css';

interface TransferModalProps {
  equipment: Equipment;
  locations: Location[];
  onTransfer: (locationId: number) => Promise<void>;
  onClose: () => void;
}

export function TransferModal({ equipment, locations, onTransfer, onClose }: TransferModalProps) {
  const [selectedLocation, setSelectedLocation] = useState<number>(equipment.location_id);
  const [loading, setLoading] = useState(false);

  const groupedLocations = {
    Warehouse: locations.filter((l) => l.building_type === 'Warehouse'),
    Classroom: locations.filter((l) => l.building_type === 'Classroom'),
    Office: locations.filter((l) => l.building_type === 'Office'),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedLocation === equipment.location_id) {
      onClose();
      return;
    }

    setLoading(true);
    try {
      await onTransfer(selectedLocation);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Transfer Equipment</h2>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="transfer-equipment-info">
              <div className="transfer-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M8 21h8M12 17v4" />
                </svg>
              </div>
              <div className="transfer-details">
                <span className="transfer-model">{equipment.model}</span>
                <span className="transfer-type">{equipment.equipment_type}</span>
              </div>
            </div>

            <div className="transfer-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </div>

            <div className="form-group">
              <label htmlFor="location">Select New Location</label>
              <select
                id="location"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(Number(e.target.value))}
              >
                {Object.entries(groupedLocations).map(([type, locs]) => (
                  <optgroup key={type} label={type}>
                    {locs.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.room_name}
                        {loc.id === equipment.location_id ? ' (Current)' : ''}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || selectedLocation === equipment.location_id}
            >
              {loading ? (
                <>
                  <span className="btn-spinner" />
                  Transferring...
                </>
              ) : (
                'Transfer'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

