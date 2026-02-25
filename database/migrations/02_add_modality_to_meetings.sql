ALTER TABLE corporate_governance.meetings
ADD COLUMN modality VARCHAR(20) DEFAULT 'PRESENCIAL' CHECK (modality IN ('PRESENCIAL', 'VIRTUAL'));
