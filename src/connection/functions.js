const { getConnection } = require("./database");

const getUsers = async () => {
  const conn = await getConnection();
  const results = await conn.query("SELECT * FROM users");
  return results;
};

const login = async ({ user, password }) => {
  console.log(user, password);
};

module.exports = {
  getUsers,
  login,
};
