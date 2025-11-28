import { useState, useEffect, useCallback } from 'react';
import { Equipment, Location, Stats, BuildingType, EquipmentFormData } from './types';
import { equipmentApi, locationsApi, statsApi } from './api';
import { Navbar } from './components/Navbar';
import { EquipmentModal } from './components/EquipmentModal';
import { TransferModal } from './components/TransferModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { Toast } from './components/Toast';
import './App.css';

function App() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const [filterType, setFilterType] = useState<BuildingType>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [transferringEquipment, setTransferringEquipment] = useState<Equipment | null>(null);
  const [deletingEquipment, setDeletingEquipment] = useState<Equipment | null>(null);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [equipmentData, locationsData, statsData] = await Promise.all([
        equipmentApi.getAll(),
        locationsApi.getAll(),
        statsApi.get(),
      ]);
      setEquipment(equipmentData);
      setLocations(locationsData);
      setStats(statsData);
    } catch {
      showToast('Failed to fetch data', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredEquipment = equipment.filter((item) => {
    const matchesType = filterType === 'All' || item.building_type === filterType;
    const matchesSearch =
      searchQuery === '' ||
      item.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.equipment_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.room_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleAddEquipment = async (data: EquipmentFormData) => {
    try {
      await equipmentApi.create(data);
      await fetchData();
      setShowAddModal(false);
      showToast('Equipment added successfully', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to add equipment', 'error');
    }
  };

  const handleEditEquipment = async (data: EquipmentFormData) => {
    if (!editingEquipment) return;
    try {
      await equipmentApi.update(editingEquipment.id, data);
      await fetchData();
      setEditingEquipment(null);
      showToast('Equipment updated successfully', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to update equipment', 'error');
    }
  };

  const handleTransfer = async (locationId: number) => {
    if (!transferringEquipment) return;
    try {
      await equipmentApi.transfer(transferringEquipment.id, locationId);
      await fetchData();
      setTransferringEquipment(null);
      showToast('Equipment transferred successfully', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to transfer equipment', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deletingEquipment) return;
    try {
      await equipmentApi.delete(deletingEquipment.id);
      await fetchData();
      setDeletingEquipment(null);
      showToast('Equipment deleted successfully', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to delete equipment', 'error');
    }
  };

  const locationStats = {
    Warehouse: stats?.byLocation.find((l) => l.building_type === 'Warehouse')?.count || 0,
    Classroom: stats?.byLocation.find((l) => l.building_type === 'Classroom')?.count || 0,
    Office: stats?.byLocation.find((l) => l.building_type === 'Office')?.count || 0,
  };

  const filters: BuildingType[] = ['All', 'Warehouse', 'Classroom', 'Office'];

  const typeIcons: Record<string, JSX.Element> = {
    Monitor: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
    Laptop: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 16V6a2 2 0 00-2-2H6a2 2 0 00-2 2v10"/><path d="M2 16h20l-2 4H4z"/></svg>,
    Desktop: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
    Keyboard: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"/></svg>,
    Mouse: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="2" width="12" height="20" rx="6"/><path d="M12 6v4"/></svg>,
    Printer: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9V2h12v7"/><rect x="2" y="9" width="20" height="10" rx="2"/><path d="M6 19v3h12v-3"/></svg>,
    Projector: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="8" width="20" height="10" rx="2"/><circle cx="8" cy="13" r="2"/></svg>,
  };

  const getIcon = (type: string) => typeIcons[type] || typeIcons['Monitor'];

  return (
    <div className="app">
      <Navbar onAddClick={() => setShowAddModal(true)} />
      
      <main className="main">
        <div className="stats-bar">
          <button 
            className={`stat-item total ${filterType === 'All' ? 'active' : ''}`}
            onClick={() => setFilterType('All')}
          >
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-label">Total</span>
              <span className="stat-value">{stats?.total || 0}</span>
            </div>
          </button>
          
          <button 
            className={`stat-item warehouse ${filterType === 'Warehouse' ? 'active' : ''}`}
            onClick={() => setFilterType('Warehouse')}
          >
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 21V8l9-5 9 5v13"/><path d="M9 21V12h6v9"/>
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-label">Warehouse</span>
              <span className="stat-value">{locationStats.Warehouse}</span>
            </div>
          </button>
          
          <button 
            className={`stat-item classroom ${filterType === 'Classroom' ? 'active' : ''}`}
            onClick={() => setFilterType('Classroom')}
          >
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="14" rx="2"/><path d="M7 22h10M12 18v4"/>
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-label">Classrooms</span>
              <span className="stat-value">{locationStats.Classroom}</span>
            </div>
          </button>
          
          <button 
            className={`stat-item office ${filterType === 'Office' ? 'active' : ''}`}
            onClick={() => setFilterType('Office')}
          >
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 6h6M9 10h6M9 14h4"/>
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-label">Offices</span>
              <span className="stat-value">{locationStats.Office}</span>
            </div>
          </button>
        </div>

        <section className="equipment-section">
          <div className="section-header">
            <h2>Equipment List</h2>
            <span className="item-count">{filteredEquipment.length} items</span>
          </div>
          
          <div className="filter-bar">
            <div className="search-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search equipment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-tabs">
              {filters.map((f) => (
                <button
                  key={f}
                  className={`filter-tab ${filterType === f ? 'active' : ''}`}
                  onClick={() => setFilterType(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          
          {loading ? (
            <div className="loading-state">
              <div className="spinner" />
              <p>Loading equipment...</p>
            </div>
          ) : filteredEquipment.length === 0 ? (
            <div className="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
              </svg>
              <h3>No equipment found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            <table className="equipment-table">
              <thead>
                <tr>
                  <th>Equipment</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEquipment.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="equipment-cell">
                        <div className="equipment-icon">{getIcon(item.equipment_type)}</div>
                        <div>
                          <div className="equipment-model">{item.model}</div>
                          <div className="equipment-id">ID: {item.id}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="type-badge">{item.equipment_type}</span></td>
                    <td>
                      <div className="location-cell">
                        <span className={`building-badge badge-${item.building_type.toLowerCase()}`}>
                          {item.building_type}
                        </span>
                        <span className="room-name">{item.room_name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn" onClick={() => setEditingEquipment(item)} title="Edit">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button className="action-btn" onClick={() => setTransferringEquipment(item)} title="Transfer">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 014-4h14"/>
                            <path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 01-4 4H3"/>
                          </svg>
                        </button>
                        <button className="action-btn delete" onClick={() => setDeletingEquipment(item)} title="Delete">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/>
                            <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>

      {showAddModal && (
        <EquipmentModal title="Add New Equipment" onSubmit={handleAddEquipment} onClose={() => setShowAddModal(false)} />
      )}
      {editingEquipment && (
        <EquipmentModal title="Edit Equipment" equipment={editingEquipment} onSubmit={handleEditEquipment} onClose={() => setEditingEquipment(null)} />
      )}
      {transferringEquipment && (
        <TransferModal equipment={transferringEquipment} locations={locations} onTransfer={handleTransfer} onClose={() => setTransferringEquipment(null)} />
      )}
      {deletingEquipment && (
        <DeleteConfirmModal equipment={deletingEquipment} onConfirm={handleDelete} onClose={() => setDeletingEquipment(null)} />
      )}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

export default App;
