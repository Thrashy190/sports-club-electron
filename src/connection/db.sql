CREATE TABLE users(
    user_id INT NOT NULL AUTO_INCREMENT,
    user_name VARCHAR(255),
    password VARCHAR(255),
    PRIMARY KEY(user_id),
    UNIQUE(user_name)
);

CREATE TABLE partners(
	partner_id INT NOT NULL AUTO_INCREMENT,
	name VARCHAR(255),
	curp VARCHAR(255),
	address VARCHAR(255),
	phone INT,
	email VARCHAR(255),
	partner_type INT,
	file_rute_pdf VARCHAR(255),
	date_entry DATETIME,
	date_reentry DATETIME,
	date_change DATETIME,
    status BOOLEAN,
	PRIMARY KEY (partner_id)
);

CREATE TABLE deaths(
	death_id INT NOT NULL AUTO_INCREMENT,
	date_death DATETIME,
	beneficiary_name VARCHAR(255),
	death_amount DOUBLE,
	partner_id INT NOT NULL,
	PRIMARY KEY (death_id),
	CONSTRAINT fk_partner_id_death FOREIGN KEY (partner_id) REFERENCES partners (partner_id)
);

CREATE TABLE payments(
    payment_id INT NOT NULL AUTO_INCREMENT,
    date_payment DATETIME,
    amount DOUBLE,
    partner_id INT NOT NULL,
    PRIMARY KEY (payment_id),
    CONSTRAINT fk_partner_id_payment FOREIGN KEY (partner_id) REFERENCES partners (partner_id)
);

CREATE TABLE tariffs(
    tariff_id INT NOT NULL AUTO_INCREMENT,
    concept VARCHAR(255),
    amount DOUBLE,
    tariff_type INT,
    PRIMARY KEY (tariff_id)
);

CREATE TABLE payment_has_tariffs(
    payment_id INT NOT NULL,
    tariff_id INT NOT NULL,
    CONSTRAINT fk_payment_id_payment_has_tariffs FOREIGN KEY (payment_id) REFERENCES payments (payment_id),
    CONSTRAINT fk_tariff_id_payment_has_tariffs FOREIGN KEY (tariff_id) REFERENCES tariffs (tariff_id)
);



