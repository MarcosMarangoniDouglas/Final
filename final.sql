drop database final;
create database final;
use final;
CREATE TABLE Country (
    `code` VARCHAR(100) PRIMARY KEY,
    `name` VARCHAR(100),
    `continent` VARCHAR(100),
    `region` VARCHAR(100),
    `surface_area` INT(10),
    `indep_year` INT(10),
    `population` INT(15),
    `life_expectancy` DOUBLE(5,2),
    `gnp` INT(10),
    `gnp_old` INT(10),
    `local_name` VARCHAR(100),
    `government_form` VARCHAR(100),
    `head_of_state` VARCHAR(100),
    `capital` INT(10),
    `code2` VARCHAR(100)
);

CREATE TABLE AfricanCrise (
    `case` INT(10),
    `cc3` VARCHAR(100),
    `country` VARCHAR(100),
    `year` INT(10),
    `systematic_crisis` INT(10),
    `exch_usd` INT(10),
    `domestic_debt_in_default` INT(10),
    `sovereign_external_debt_default` INT(10),
    `gdp_weighted_default` INT(10),
    `inflation_annual_cpi` DOUBLE(10,2),
    `independece` INT (10),
    `currency_crisis` INT(10),
    `inflation_crisis` INT(10),
    `banking_crisis` VARCHAR(100),
    FOREIGN KEY (`cc3`) REFERENCES Country(`code`)
);
