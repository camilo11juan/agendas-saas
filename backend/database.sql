-- database_mysql.sql

-- 1. Tabla de Negocios
CREATE TABLE businesses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    logo_url TEXT,
    color_scheme VARCHAR(20),
    active BOOLEAN DEFAULT TRUE
);

-- 2. Configuración de Horarios
CREATE TABLE business_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    business_id INT,
    day_of_week INT, -- 0=Domingo, 1=Lunes...
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    is_closed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (business_id) REFERENCES businesses(id)
);

-- 3. Servicios
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    business_id INT,
    name VARCHAR(100),
    duration_min INT NOT NULL,
    price DECIMAL(10,2),
    FOREIGN KEY (business_id) REFERENCES businesses(id)
);

-- 4. Citas
CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    business_id INT,
    service_id INT,
    customer_name VARCHAR(100),
    customer_phone VARCHAR(20),
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    status VARCHAR(20) DEFAULT 'confirmed',
    FOREIGN KEY (business_id) REFERENCES businesses(id),
    FOREIGN KEY (service_id) REFERENCES services(id)
);

-- DATOS DE PRUEBA (Ejecutar después de crear las tablas)
INSERT INTO businesses (name, slug, color_scheme) VALUES ('Barbería El Bravo', 'barberia-bravo', '#e11d48');
INSERT INTO business_settings (business_id, day_of_week, open_time, close_time) VALUES (1, 1, '08:00', '20:00'); 
-- ... inserta los demás días ...
INSERT INTO services (business_id, name, duration_min, price) VALUES (1, 'Corte Clásico', 30, 20.00);