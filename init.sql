CREATE TABLE record (
  location varchar(10) NOT NULL,
  timestamp varchar(45) NOT NULL,
  signature varchar(45) NOT NULL,
  material float NOT NULL,
  a float NOT NULL,
  b float NOT NULL,
  c float NOT NULL,
  d float NOT NULL,
  date varchar(45) NOT NULL,
  create_time varchar(45) NOT NULL,
  PRIMARY KEY (location,`timestamp`,`signature`,`material`,`a`,`b`,`c`,`d`,`date`,`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;