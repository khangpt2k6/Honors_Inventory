import './Navbar.css';

interface NavbarProps {
  onAddClick: () => void;
}

export function Navbar({ onAddClick }: NavbarProps) {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <img src="/images.jpg" alt="USF" className="navbar-logo" />
        <div className="navbar-title">
          <div className="navbar-title-main"><strong>Honors Inventory</strong></div>
          <div className="navbar-title-sub">Judy Genshaft Honors College</div>
        </div>
      </div>
      <button className="navbar-button" onClick={onAddClick}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add Equipment
      </button>
    </header>
  );
}

