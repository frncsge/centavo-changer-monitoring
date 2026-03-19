 CREATE TABLE machine_storage (
	machine_id INT NOT NULL,
	peso_value INT NOT NULL,
	quantity INT NOT NULL,
	PRIMARY KEY (machine_id, peso_value),
	FOREIGN KEY (machine_id)
	REFERENCES machines(machine_id)	 	
);   