
DROP TABLE IF EXISTS equipment;
DROP TABLE IF EXISTS locations;

CREATE TABLE locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_name VARCHAR(100) NOT NULL UNIQUE,
    building_type VARCHAR(50) NOT NULL CHECK (building_type IN ('Warehouse', 'Classroom', 'Office'))
);

CREATE TABLE equipment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    model VARCHAR(100) NOT NULL,
    equipment_type VARCHAR(50) NOT NULL,
    location_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (location_id) REFERENCES locations(id)
);

INSERT INTO locations (room_name, building_type) VALUES
    ('HON Warehouse', 'Warehouse'),
    ('HON 3017', 'Classroom'),
    ('HON 3018', 'Classroom'),
    ('HON 3019', 'Classroom'),
    ('HON 4015A', 'Office'),
    ('HON 4015B', 'Office'),
    ('HON 4016', 'Office');

INSERT INTO equipment (model, equipment_type, location_id) VALUES
    -- warehouse items (location_id = 1)
    ('Dell P2722H', 'Monitor', 1),
    ('Dell P2722H', 'Monitor', 1),
    ('Dell P2722H', 'Monitor', 1),
    ('Logitech MK270', 'Keyboard', 1),
    ('Logitech MK270', 'Keyboard', 1),
    ('Logitech M185', 'Mouse', 1),
    ('Logitech M185', 'Mouse', 1),
    
    -- hon 3017 classroom (location_id = 2)
    ('HP LaserJet Pro M404n', 'Printer', 2),
    ('Dell Latitude 5520', 'Laptop', 2),
    ('Dell P2722H', 'Monitor', 2),
    
    -- hon 3018 classroom (location_id = 3)
    ('Epson PowerLite X49', 'Projector', 3),
    ('Dell Latitude 5520', 'Laptop', 3),
    
    -- hon 3019 classroom (location_id = 4)
    ('HP LaserJet Pro M404n', 'Printer', 4),
    ('Dell OptiPlex 7090', 'Desktop', 4),
    ('Dell P2722H', 'Monitor', 4),
    
    -- hon 4015A office (location_id = 5)
    ('Dell Elite8', 'Laptop', 5),
    ('Dell UltraSharp U2722D', 'Monitor', 5),
    ('Logitech MX Keys', 'Keyboard', 5),
    ('Logitech MX Master 3', 'Mouse', 5),
    
    -- hon 4015B office (location_id = 6)
    ('Dell Elite8', 'Laptop', 6),
    ('Dell UltraSharp U2722D', 'Monitor', 6),
    ('HP LaserJet Pro M404n', 'Printer', 6),
    
    -- hon 4016 office (location_id = 7)
    ('MacBook Pro 14"', 'Laptop', 7),
    ('Apple Studio Display', 'Monitor', 7),
    ('Apple Magic Keyboard', 'Keyboard', 7),
    ('Apple Magic Mouse', 'Mouse', 7);

