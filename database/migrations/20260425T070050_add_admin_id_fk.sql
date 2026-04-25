ALTER TABLE machines 
ADD COLUMN admin_id INT;

ALTER TABLE machines
ADD CONSTRAINT fk_machines_admin
FOREIGN KEY (admin_id)
REFERENCES admins(admin_id);