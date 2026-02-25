-- Drop Schema if exists to allow rerunning cleanly
DROP SCHEMA IF EXISTS corporate_governance CASCADE;

-- Create Schema
CREATE SCHEMA corporate_governance;

-- Tables

-- Roles Catalog Table
CREATE TABLE corporate_governance.roles (
    code VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Users Table
CREATE TABLE corporate_governance.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role_code VARCHAR(50) NOT NULL REFERENCES corporate_governance.roles(code),
    avatar_url VARCHAR(500),
    is_external BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Committee Roles Catalog Table
CREATE TABLE corporate_governance.committee_roles (
    code VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- Committees Table
CREATE TABLE corporate_governance.committees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('INTERNAL', 'EXTERNAL')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Committee Members (Join Table)
CREATE TABLE corporate_governance.committee_members (
    committee_id UUID REFERENCES corporate_governance.committees(id) ON DELETE CASCADE,
    user_id UUID REFERENCES corporate_governance.users(id) ON DELETE CASCADE,
    role_code VARCHAR(50) NOT NULL DEFAULT 'MEMBER' REFERENCES corporate_governance.committee_roles(code),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'America/Santo_Domingo'),
    PRIMARY KEY (committee_id, user_id)
);

-- Meetings Table
CREATE TABLE corporate_governance.meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    committee_id UUID REFERENCES corporate_governance.committees(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('ORDINARY', 'EXTRAORDINARY')),
    date DATE NOT NULL,
    time TIME NOT NULL,
    modality VARCHAR(20) DEFAULT 'PRESENCIAL' CHECK (modality IN ('PRESENCIAL', 'VIRTUAL')),
    location VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'AGENDA_SENT', 'IN_PROGRESS', 'PENDING_SIGNATURE', 'COMPLETED', 'CANCELLED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Agenda Topics Table (NEW)
CREATE TABLE corporate_governance.agenda_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID REFERENCES corporate_governance.meetings(id) ON DELETE CASCADE,
    topic_title VARCHAR(500) NOT NULL,
    duration_minutes INT,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Meeting Comments Table (NEW)
CREATE TABLE corporate_governance.meeting_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID REFERENCES corporate_governance.meetings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES corporate_governance.users(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Meeting Participants (Join Table)
CREATE TABLE corporate_governance.meeting_participants (
    meeting_id UUID REFERENCES corporate_governance.meetings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES corporate_governance.users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING_SIGNATURE' CHECK (status IN ('PENDING_SIGNATURE', 'PRESENT', 'ABSENT')),
    PRIMARY KEY (meeting_id, user_id)
);

-- Documents Table
CREATE TABLE corporate_governance.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID REFERENCES corporate_governance.meetings(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('PPTX', 'PDF', 'DOCX')),
    category VARCHAR(20) NOT NULL DEFAULT 'SUPPORT_DOC' CHECK (category IN ('SUPPORT_DOC', 'PRESENTATION', 'ACTA')),
    url VARCHAR(500) NOT NULL,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'America/Santo_Domingo')
);

-- Signatures Table
CREATE TABLE corporate_governance.signatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES corporate_governance.documents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES corporate_governance.users(id) ON DELETE CASCADE,
    signature_base64 TEXT NOT NULL,
    signed_at TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'America/Santo_Domingo'),
    UNIQUE (document_id, user_id)
);

-- Menu Permissions Configuration Table
CREATE TABLE corporate_governance.menu_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_code VARCHAR(50) NOT NULL REFERENCES corporate_governance.roles(code) ON DELETE CASCADE,
    menu_key VARCHAR(100) NOT NULL,
    can_read BOOLEAN NOT NULL DEFAULT FALSE,
    can_write BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE (role_code, menu_key)
);

-- Dummy Data Insertion

-- 1A. Roles (Global/System)
INSERT INTO corporate_governance.roles (code, name) VALUES
('SEC_GEN', 'Secretaria General'),
('DIR_GEN', 'Director General'),
('ANA_RIESGOS', 'Analista de Riesgos'),
('ACCIONISTA', 'Accionista Principal'),
('CONSULTA_EXT', 'Consultora Externa'),
('GER_FIN', 'Gerente Financiero')
ON CONFLICT DO NOTHING;

-- 1B. Committee Roles (Per-Committee)
INSERT INTO corporate_governance.committee_roles (code, name, description) VALUES
('SECRETARY', 'Secretario', 'Dentro del comité, es responsable de convocar reuniones, gestionar agendas, redactar actas y administrar la operación del comité.'),
('SUPPORT', 'Soporte', 'Dentro del comité, brinda apoyo operativo, puede preparar documentos y asistir al secretario en sus funciones.'),
('MEMBER', 'Miembro', 'Dentro del comité, participa en las reuniones, delibera y vota en las decisiones correspondientes.')
ON CONFLICT DO NOTHING;

-- 1B. Users
INSERT INTO corporate_governance.users (id, email, name, role_code, avatar_url, is_external) VALUES
('ea912a76-2f08-41df-a5e7-2b0e77d33d73', 'laura.gomez@empresa.com', 'Laura Gómez', 'SEC_GEN', 'https://ui-avatars.com/api/?name=Laura+Gomez&background=0D8ABC&color=fff', FALSE),
('a0000000-0000-0000-0000-000000000002', 'carlos.diaz@empresa.com', 'Carlos Díaz', 'DIR_GEN', 'https://ui-avatars.com/api/?name=Carlos+Diaz&background=1D4ED8&color=fff', FALSE),
('a0000000-0000-0000-0000-000000000003', 'ana.martinez@empresa.com', 'Ana Martínez', 'ANA_RIESGOS', 'https://ui-avatars.com/api/?name=Ana+Martinez&background=047857&color=fff', FALSE),
('a0000000-0000-0000-0000-000000000004', 'roberto.torres@externo.com', 'Roberto Torres', 'ACCIONISTA', 'https://ui-avatars.com/api/?name=Roberto+Torres&background=B91C1C&color=fff', TRUE),
('a0000000-0000-0000-0000-000000000005', 'elena.ramirez@consultoria.com', 'Elena Ramírez', 'CONSULTA_EXT', 'https://ui-avatars.com/api/?name=Elena+Ramirez&background=9D174D&color=fff', TRUE),
('a0000000-0000-0000-0000-000000000006', 'miguel.vargas@empresa.com', 'Miguel Vargas', 'GER_FIN', 'https://ui-avatars.com/api/?name=Miguel+Vargas&background=4338CA&color=fff', FALSE)
ON CONFLICT DO NOTHING;

-- 2. Committees
INSERT INTO corporate_governance.committees (id, name, type, description) VALUES
('b0000000-0000-0000-0000-000000000001', 'Comité de Auditoría', 'INTERNAL', 'Supervisa procesos contables y auditorías internas.'),
('b0000000-0000-0000-0000-000000000002', 'Asamblea de Accionistas', 'EXTERNAL', 'Reunión general de los accionistas para decisiones estratégicas.')
ON CONFLICT DO NOTHING;

-- 3. Committee Members
INSERT INTO corporate_governance.committee_members (committee_id, user_id, role_code) VALUES
('b0000000-0000-0000-0000-000000000001', 'ea912a76-2f08-41df-a5e7-2b0e77d33d73', 'SECRETARY'),
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'MEMBER'),
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000006', 'MEMBER'),
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', 'SUPPORT'),

('b0000000-0000-0000-0000-000000000002', 'ea912a76-2f08-41df-a5e7-2b0e77d33d73', 'SECRETARY'),
('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000004', 'MEMBER'),
('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000005', 'MEMBER')
ON CONFLICT DO NOTHING;

-- 4. Meetings (1 pending, 1 upcoming, 1 past)
INSERT INTO corporate_governance.meetings (id, committee_id, type, date, time, status, location) VALUES
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'ORDINARY', '2024-03-10', '10:00:00', 'PENDING_SIGNATURE', 'Sala de Juntas Piso 5'),
('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'EXTRAORDINARY', '2024-04-15', '14:30:00', 'AGENDA_SENT', 'Microsoft Teams'),
('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'ORDINARY', '2024-01-20', '09:00:00', 'COMPLETED', 'Sala de Juntas Piso 5')
ON CONFLICT DO NOTHING;

-- 5. Agenda Topics
INSERT INTO corporate_governance.agenda_topics (meeting_id, topic_title, duration_minutes, order_index) VALUES
('c0000000-0000-0000-0000-000000000001', 'Revisión de Estados Financieros Q4 2023', 45, 1),
('c0000000-0000-0000-0000-000000000001', 'Presentación de Informe del Auditor Externo', 30, 2),
('c0000000-0000-0000-0000-000000000002', 'Aprobación de Venta de Activos No Estratégicos', 60, 1),
('c0000000-0000-0000-0000-000000000003', 'Presupuesto Anual 2024', 90, 1)
ON CONFLICT DO NOTHING;

-- 6. Meeting Comments
INSERT INTO corporate_governance.meeting_comments (meeting_id, user_id, comment) VALUES
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'Revisar la nota 14 de los estados financieros antes de la reunión.'),
('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000004', 'Requiero acceso al informe de tasación previo.')
ON CONFLICT DO NOTHING;

-- 7. Meeting Participants
INSERT INTO corporate_governance.meeting_participants (meeting_id, user_id, status) VALUES
-- Pending Signature (Only one has signed, others pending)
('c0000000-0000-0000-0000-000000000001', 'ea912a76-2f08-41df-a5e7-2b0e77d33d73', 'PRESENT'), -- signed
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'PENDING_SIGNATURE'),
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000006', 'PENDING_SIGNATURE'),
-- Upcoming (Status is PRESENT by default? Or leave empty / another status. Let's say all PENDING_SIGNATURE as placeholder for "invited")
('c0000000-0000-0000-0000-000000000002', 'ea912a76-2f08-41df-a5e7-2b0e77d33d73', 'PENDING_SIGNATURE'),
('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000004', 'PENDING_SIGNATURE'),
('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000005', 'PENDING_SIGNATURE'),
-- Past (All present)
('c0000000-0000-0000-0000-000000000003', 'ea912a76-2f08-41df-a5e7-2b0e77d33d73', 'PRESENT'),
('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000002', 'PRESENT'),
('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000006', 'ABSENT')
ON CONFLICT DO NOTHING;

-- 8. Documents
INSERT INTO corporate_governance.documents (id, meeting_id, name, type, category, url) VALUES
-- Pending meeting 1 documents
('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Presentación Financiera Q4', 'PPTX', 'PRESENTATION', 'https://ejemplo.com/ppt'),
('d0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'Reporte_Auditoria_Externa.pdf', 'PDF', 'SUPPORT_DOC', 'https://ejemplo.com/doc'),
('d0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'Acta_Comite_Auditoria_Marzo.pdf', 'PDF', 'ACTA', 'https://ejemplo.com/acta'),
-- Upcoming meeting 2 documents
('d0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000002', 'Tasacion_Activos.docx', 'DOCX', 'SUPPORT_DOC', 'https://ejemplo.com/tasacion'),
-- Past meeting 3 documents
('d0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000003', 'Presupuesto_Aprobado_2024.pdf', 'PDF', 'ACTA', 'https://ejemplo.com/acta_presupuesto')
ON CONFLICT DO NOTHING;

-- 9. Menu Permissions
INSERT INTO corporate_governance.menu_permissions (role_code, menu_key, can_read, can_write) VALUES
-- All roles: Home (read + write)
('SEC_GEN', '/home', TRUE, TRUE),
('DIR_GEN', '/home', TRUE, TRUE),
('ANA_RIESGOS', '/home', TRUE, TRUE),
('ACCIONISTA', '/home', TRUE, TRUE),
('CONSULTA_EXT', '/home', TRUE, TRUE),
('GER_FIN', '/home', TRUE, TRUE),
-- Only SEC_GEN: Committees (read + write)
('SEC_GEN', '/committees', TRUE, TRUE)
ON CONFLICT DO NOTHING;
