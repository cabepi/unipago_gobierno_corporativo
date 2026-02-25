ALTER TABLE corporate_governance.documents
DROP CONSTRAINT documents_type_check;

ALTER TABLE corporate_governance.documents
ADD CONSTRAINT documents_type_check CHECK (type IN ('PPTX', 'PDF', 'DOCX', 'PNG', 'JPG', 'JPEG'));
