CREATE TYPE user_role AS ENUM ('admin', 'writer');

CREATE TABLE user
(
  id             uuid NOT NULL UNIQUE,
  name       	   VARCHAR(255) NOT NULL ,
  email			     VARCHAR(155) NOT NULL UNIQUE,
  phone			     VARCHAR(11) UNIQUE,
  password       VARCHAR(255) NOT NULL,
  code           VARCHAR(6) NOT NULL UNIQUE,
  roles          user_role NOT NULL DEFAULT 'writer',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMPTZ,
  is_deleted     BOOLEAN NOT NULL DEFAULT 'f',
  PRIMARY KEY (id)
);