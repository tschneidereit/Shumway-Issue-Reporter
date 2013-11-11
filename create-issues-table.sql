CREATE TABLE issues (
    id              serial primary key,
    submission      timestamp,
    pageUrl         varchar(2000) NOT NULL,
    swfUrl          varchar(2000) NOT NULL,
    shumwayVersion  varchar(10) NOT NULL,
    firefoxVersion  varchar(25) NOT NULL,
    email           varchar(255),
    description     text
)