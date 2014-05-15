DROP TABLE issues;

CREATE TABLE IF NOT EXISTS issues (
    id              serial primary key,
    submission      timestamp,
    pageurl         varchar(2000) NOT NULL,
    swfurl          varchar(2000) NOT NULL,
    shumwayversion  varchar(10) NOT NULL,
    firefoxversion  varchar(25) NOT NULL,
    email           varchar(255),
    description     text,
    exceptions		text
)