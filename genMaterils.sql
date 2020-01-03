CREATE TABLE materials
(
id SERIAL PRIMARY KEY,
pid INT NOT NULL,
material_code VARCHAR(255) NOT NULL,
material_group VARCHAR(255) NOT NULL,
discription VARCHAR(255),
material_name VARCHAR(255) NOT NULL,
base_price decimal,
gst INT,
created_at TIMESTAMP NOT NULL,
created_by VARCHAR(255) NOT NULL,
last_updated_by VARCHAR(255) NOT NULL,
last_updated_at TIMESTAMP NOT NULL
);

CREATE UNIQUE INDEX material_code_material_group_idxs ON materials (material_code,material_group);
