const mysql = require('mysql2');

const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // TODO: Add MySQL password here
      password: '',
      database: 'company_db'
    },
    console.log(`Connected to the movies_db database.`)
  );

function queryDepartments() {
    const sql = `SELECT * FROM departments`;
    return db.promise().query(sql);
}

function queryJobs() {
    const sql = `SELECT * FROM jobs`;
    return db.promise().query(sql);
};

function queryEmployees() {
    const sql = `SELECT * FROM employees`;
    return db.promise().query(sql);
}

module.exports = { queryDepartments, queryJobs, queryEmployees }