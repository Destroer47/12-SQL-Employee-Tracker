const inquirer = require('inquirer');
const mysql = require('mysql2');
const table = require('console.table');
const { 
    queryDepartments, 
    queryJobs,
    queryEmployees 
} = require('./db/queries.js');

const questions = [
    {
        type: 'list',
        message: 'What would you like to do?',
        name: 'action',
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 
            'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role', 'Exit'],
        default: 'View All Departments'
    }
];

//example function for view options;
function viewDepartments() {
    queryDepartments().then((res) => {
        console.log("\n");
        console.table(res[0]);
        init();
    })
    .catch((err) => console.log(err));
  }

function viewRoles() {
    queryJobs().then((res) => {
        console.log("\n");
        console.table(res[0]);
        init();
    })
    .catch((err) => console.log(err));
}

function viewEmployees() {
    queryEmployees().then((res) => {
        console.log("\n");
        console.table(res[0]);
        init();
    })
    .catch((err) => console.log(err));
}

function addDepartment() {
    inquirer.prompt({
        type: 'input',
        message: 'Input department name.',
        name: 'department-name',
        validate: (input) => {
            if (input) {return true}
            else {return 'Please enter a name for the department'}
        }
    }).then((data) => {
        console.log(data);
    })
}

function init () {
    inquirer.prompt(questions)
        .then((data) => {
            const choice = data.action;
            
            if(choice === 'View All Departments') {viewDepartments()}
            else if(choice === 'View All Roles') {viewRoles()}
            else if(choice === 'View All Employees') {viewEmployees()}
            else if(choice === 'Add Department') {addDepartment()}
            else if(choice === 'Add Role') {}
            else if(choice === 'Add Employee') {}
            else if(choice === 'Update Employee Role') {}
            else if(choice === 'Exit') {console.log('Exiting now.'), process.exit();}
            
        })
};

init();

//note, figure out how to use console.table