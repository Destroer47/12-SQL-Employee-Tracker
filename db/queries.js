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
    console.log(`Connected to the company_db database.`)
  );

function queryDepartments() {
    const sql = `SELECT * FROM departments`;
    return db.promise().query(sql);
}

function queryJobs() {
    const sql = `SELECT jobs.id AS id, jobs.title AS title, jobs.salary As salary, departments.name AS department_name 
    FROM jobs JOIN departments ON jobs.department_id = departments.id`;
    return db.promise().query(sql);
};

function queryEmployees() {
    const sql = `SELECT employees.id AS id, employees.first_name AS first_name, employees.last_name AS last_name, jobs.title AS job_title, jobs.salary AS salary, departments.name AS department_name, CONCAT(manager_name.first_name, " ", manager_name.last_name) AS manager_name
    FROM employees INNER JOIN jobs ON employees.job_id = jobs.id INNER JOIN departments ON jobs.department_id = departments.id LEFT JOIN employees AS manager_name ON employees.manager_id = manager_name.id`;
    return db.promise().query(sql);
}

function insertDepartment(data) {
    const sql = `INSERT INTO departments (name) VALUES ('${data}')`;
    return db.promise().query(sql);
}

function insertJobs (data, depObj) {
    const title = data.title;
    const salary = data.salary;
    const id = depObj.id;
    const sql = `INSERT INTO jobs ( title, salary, department_id) VALUES ('${title}', ${salary}, ${id})`;
    return db.promise().query(sql);
}

function insertEmployees (data, jobObj, managerObj) {
    const fName = data.firstName;
    const lName = data.lastName;
    const job = jobObj.id;
    let managerId
    if (data.manager === 'None') {
        return managerId = null;
    } else {
        managerId = managerObj.id;
    }
    const sql = `INSERT INTO employees ( first_name, last_name, job_id, manager_id ) VALUES ('${fName}', '${lName}', ${job}, ${managerId})`;
    return db.promise().query(sql);
}

function updateEmployeeTable (employeeObj, jobObjArray) {
    const empName = employeeObj.id;
    const roleChange = jobObjArray[0].id;
    const sql = `UPDATE employees SET job_id = ${roleChange} WHERE id = ${empName}`;
    return db.promise().query(sql);
}

module.exports = { queryDepartments, queryJobs, queryEmployees, insertDepartment, insertJobs, insertEmployees, updateEmployeeTable }