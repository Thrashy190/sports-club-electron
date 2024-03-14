const { default: autoTable } = require("jspdf-autotable");
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

  const results = await conn.query(
    "SELECT P.* FROM partners P LEFT JOIN deaths D ON P.partner_id = D.partner_id WHERE D.partner_id IS NULL;"
  );
  return results;
}

async function updateCategory(partner_id, category) {
  const conn = await getConnection();

  const results = await conn.query(
    "UPDATE partners SET partner_type = ? WHERE partner_id = ?",
    [category, partner_id]
  );
  return results;
}

async function updateReentry(partner_id, reentry) {
  const conn = await getConnection();

  const results = await conn.query(
    "UPDATE partners SET date_reentry =   WHERE partner_id = ?",
    [reentry, partner_id]
  );
  return results;
}

const createPartner = async (
  name,
  address,
  phone,
  email,
  curp,
  type,
  date_entry
) => {
  const conn = await getConnection();
  const results = await conn.query(
    "INSERT INTO partners (name, address, phone, email, curp, partner_type, date_entry) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [name, address, phone, email, curp, type, date_entry]
  );
  return results;
};

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

async function createPayments(data) {
  const { partner_id, date_payment, amount, tariffs } = data;

  const conn = await getConnection();

  const results = await conn.query(
    "INSERT INTO payments (date_payment, amount, partner_id) VALUES (?, ?, ?)",
    [date_payment, amount, partner_id]
  );

  const payment_id = results.insertId;

  for (let i = 0; i < tariffs.length; i++) {
    await conn.query(
      "INSERT INTO payment_has_tariffs (payment_id, tariff_id) VALUES (?, ?)",
      [payment_id, tariffs[i]]
    );
  }

  return results;
}

async function getPagosEfectuados(id) {
  const conn = await getConnection();

  console.log(id);

  const results = await conn.query(
    `SELECT 
      partners.partner_id, 
      partners.name, 
      payments.date_payment, 
      tariffs.amount,
      tariffs.concept 
    FROM partners 
    INNER JOIN payments ON partners.partner_id = payments.partner_id
    INNER JOIN payment_has_tariffs ON payments.payment_id = payment_has_tariffs.payment_id
    INNER JOIN tariffs ON payment_has_tariffs.tariff_id = tariffs.tariff_id
    WHERE partners.partner_id = ?`,
    [id]
  );

  console.log(results);

  return results;
}

function generarEstadoCuenta(pagos) {
  const { jsPDF } = require("jspdf");
  require("jspdf-autotable");

  const doc_file = new jsPDF();
  const img =
    "data:image/webp;base64,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";

  doc_file.text("Estado de cuenta", 15, 15);
  doc_file.addImage(img, "JPEG", 150, 5, 50, 35);
  doc_file.text("Número de socio: " + pagos[0].partner_id, 15, 25);
  doc_file.text("Nombre del socio: " + pagos[0].name, 15, 35);

  const tableData = [];

  pagos.map((pago) => {
    tableData.push([pago.date_payment, pago.amount, pago.concept]);
  });

  autoTable(doc_file, {
    head: [["Fecha de pago", "Monto total", "Concepto"]],
    body: tableData,
    startY: 40,
    startX: 15,
  });

  doc_file.save("recibos/recibo_" + pagos[0].partner_id + ".pdf");
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
  addDefuncion,
  getSocio,
  getSocios,
  updateCategory,
  updateReentry,
  getTarifas,
  addTarifa,
  createPartner,
  getPagosEfectuados,
  generarEstadoCuenta,
  updateTarifa,
  getDefuncionesWithPartner,
  createPayments,
};