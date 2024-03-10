const { getConnection } = require("./database");

// ---------------------------------------------- USERS ---------------------------------------------------

const getUsers = async () => {
  const conn = await getConnection();
  const results = conn.query("SELECT * FROM users").then((results) => {
    return results;
  });
  return results;
};

const getUsersByUser = async (user) => {
  const conn = await getConnection();
  const results = await conn.query("SELECT * FROM users WHERE user_name = ?", [
    user,
  ]);
  return results;
};

// ---------------------------------------------- SOCIOS ---------------------------------------------------

// Función para obtener datos del socio
async function getSocio(partner_id) {
  const conn = await getConnection();

  const results = await conn.query(
    "SELECT * FROM partners WHERE partner_id = ?",
    [partner_id]
  );
  return results;
}

async function getSocios() {
  const conn = await getConnection();

  return new Promise((resolve, reject) => {
    conn.query("SELECT * FROM partners", (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]);
      }
    });
  });
}

// const getParters = async () => {
//   const conn = await getConnection();
//   const results = await conn.query("SELECT * FROM partenrs");
//   return results;
// };

// const createParter = async (name, address, phone, email, curp) => {
//   const conn = await getConnection();
//   const results = await conn.query(
//     "INSERT INTO partenrs (name, address, phone, email, curp) VALUES (?, ?, ?, ?, ?)",
//     [name, address, phone, email, curp]
//   );
//   return results;
// };

// ---------------------------------------------- TARIFAS ---------------------------------------------------

async function getTarifas(type) {
  const conn = await getConnection();

  const results = await conn.query(
    "SELECT * FROM tariffs WHERE tariff_type = ?",
    [type]
  );

  return results;
}

async function addTarifa(data) {
  const { tariff_type, concept, amount } = data;
  const conn = await getConnection();

  const results = await conn.query(
    "INSERT INTO tariffs (tariff_type, concept, amount) VALUES (?, ?, ?)",
    [tariff_type, concept, amount]
  );

  return results;
}

//updateTarifa

async function updateTarifa(data) {
  const { concept, amount } = data;
  const conn = await getConnection();

  const results = await conn.query(
    "UPDATE tariffs SET  amount = ? WHERE concept = ?",
    [amount, concept]
  );

  return results;
}

// ---------------------------------------------- RECIBOS ---------------------------------------------------

// Función para registrar un pago
function registrarPago(socio_id, fecha_pago, monto_total, detalle_pago) {
  return new Promise((resolve, reject) => {
    connection.query(
      "INSERT INTO pagos (socio_id, fecha_pago, monto_total, detalle_pago) VALUES (?, ?, ?, ?)",
      [socio_id, fecha_pago, monto_total, detalle_pago],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });
}

// Función para generar el PDF del recibo
function generarRecibo(socio, fecha_pago, monto_total, detalle_pago) {
  // Implementar la lógica para generar el PDF con la información del recibo
  // ...

  // Guardar el PDF en el sistema
  const pdf = pdfMake.createPdf(contenidoPDF);
  pdf.write("recibos/recibo_" + socio.socio_id + "_" + fecha_pago + ".pdf");
}

// ---------------------------------------------- DEFUNCIONES ---------------------------------------------------

async function addDefuncion(data) {
  const { partner_id, death_date, beneficiary, amount } = data;
  const conn = await getConnection();
  const results = await conn.query(
    "INSERT INTO deaths (partner_id, date_death, beneficiary_name, death_amount) VALUES (?, ?, ?, ?)",
    [partner_id, death_date, beneficiary, amount]
  );
  return results;
}

async function getDefuncionesWithPayments() {
  const conn = await getConnection();
  const results = await conn.query(
    `
    SELECT 
      s.socio_id, 
      s.nombre, 
      SUM(p.monto_final) AS monto_acumulado, 
      d.fecha_defuncion, 
      d.monto, 
      d.nombre_beneficiario
    FROM socios s
    INNER JOIN defunciones d ON d.socio_id = s.socio_id
    INNER JOIN pagos p ON p.socio_id = s.socio_id
    GROUP BY s.socio_id, s.nombre, d.fecha_defuncion, d.monto, d.nombre_beneficiario
  `
  );
  return results;
}

async function getDefuncionesWithPartner() {
  const conn = await getConnection();
  const results = await conn.query(
    `
    SELECT 
      p.partner_id, 
      p.name, 
      d.date_death, 
      d.beneficiary_name, 
      d.death_amount
    FROM partners p
    INNER JOIN deaths d ON d.partner_id = p.partner_id
  `
  );
  return results;
}

module.exports = {
  getUsers,
  getUsersByUser,
  addDefuncion,
  getSocio,
  getSocios,
  getTarifas,
  addTarifa,
  updateTarifa,
  getDefuncionesWithPartner,
};
