CREATE TYPE role AS ENUM ('admin', 'writer');

CREATE TABLE employee
(
  id             uuid NOT NULL UNIQUE,
  name       	   VARCHAR(255) NOT NULL ,
  email			     VARCHAR(155) NOT NULL UNIQUE,
  phone			     VARCHAR(11) UNIQUE,
  password       VARCHAR(255) NOT NULL,
  code           VARCHAR(6) NOT NULL UNIQUE,
  role           role NOT NULL DEFAULT 'writer',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMPTZ,
  is_deleted     BOOLEAN NOT NULL DEFAULT 'f',
  PRIMARY KEY (id)
);

CREATE TYPE bodywork AS ENUM (
  'Esportivo', 
  'SUV', 
  'Hatch', 
  'Cupê',
  'Van', 
  'Sedan', 
  'Caminhonete', 
  'Caminhoneta'
);

CREATE TABLE brand
(
  id             uuid NOT NULL UNIQUE,
  name       	   VARCHAR(255) NOT NULL ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMPTZ,
  is_deleted     BOOLEAN NOT NULL DEFAULT 'f',
  PRIMARY KEY (id)
);

CREATE TYPE transmission AS ENUM ('Automático', 'Manual');
CREATE TYPE fuel AS ENUM ('Gasolina', 'Etanol', 'Flex', 'Diesel', 'Elétrico', 'GNV', 'Arla', 'Híbrido')

CREATE TABLE vehicle
(
  id             uuid NOT NULL UNIQUE,
  model       	 VARCHAR(255) NOT NULL,
  version        VARCHAR(155) NOT NULL,
  year           INT4 NOT NULL,
  end_plate      VARCHAR(1),
  color          VARCHAR(55) NOT NULL,
  odometer       INT4 NOT NULL,
  transmission   transmission NOT NULL,
  doors          VARCHAR(2) NOT NULL,
  bodywork       bodywork NOT NULL,
  armored        BOOLEAN NOT NULL,
  fuel           fuel,
  accessories    TEXT,
  description    TEXT,
  price          int8 NOT NULL,  
  brand_id       uuid REFERENCES brand(id),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMPTZ,
  is_deleted     BOOLEAN NOT NULL DEFAULT 'f',
  PRIMARY KEY (id)
);

CREATE TABLE vehicle_images
(
  id             uuid NOT NULL UNIQUE,
  vehicle_id     uuid REFERENCES vehicle(id) NOT NULL,
  file_position  INT4 NOT NULL,
  path           TEXT NOT NULL UNIQUE,
  filename       TEXT NOT NULL UNIQUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMPTZ,
  is_deleted     BOOLEAN NOT NULL DEFAULT 'f',
  PRIMARY KEY (id)
);
