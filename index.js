const inquirer = require('inquirer');
const table = require('console.table');
const { 
    queryDepartments, 
    queryJobs,
    queryEmployees,
    insertDepartment,
    insertJobs,
    insertEmployees,
    updateEmployeeTable
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

function viewDepartments() {
    queryDepartments().then((res) => {
        console.log("\n");
        console.table(res[0]);
        init();
    })
  }

function viewRoles() {
    queryJobs().then((res) => {
        console.log("\n");
        console.table(res[0]);
        init();
    })
}

function viewEmployees() {
    queryEmployees().then((res) => {
        console.log("\n");
        console.table(res[0]);
        init();
    })
}

function addDepartment() {
    inquirer.prompt({
        type: 'input',
        message: 'Input department name.',
        name: 'departmentName',
        validate: (input) => {
            if (input) {return true}
            else {return 'Please enter a name for the department.'}
        }
    }).then((data) => {
        const department = data.departmentName;
        insertDepartment(department);
        console.log(`Added ${department} to the database.`)
        init();
    })
}

function addRole() {
    queryDepartments().then((res) => {
        const departments = res[0];
        return departments
    }).then((res) => {
    inquirer.prompt([{
        type: 'input',
        message: 'What is the title of this Job/Role?',
        name : 'title',
        validate: (input) => {
            if (input) {return true}
            else {return 'Please enter a title for the Job/Role.'}
        }
    },
    {
        type: 'input',
        message: 'What is the salary of this role?',
        name : 'salary',
        validate: (input) => {
            if (input) {return true}
            else {return 'Please enter a salary for the Job/Role.'}
        }
    },
    {
        type: 'list',
        message: 'What department does this Job/Role belong to?',
        name : 'department',
        choices: res,
    }]).then((data) => {
        let depObj
        res.forEach((element) => {
            if (element.name === data.department) {
                depObj = element;
            }
        });
        insertJobs(data, depObj);
        console.log(`Added ${data.title} to the database.`)
        init();
    })
})
}

function addEmployee() {
    let jobData
    let empData
    queryJobs().then((res) => {
        return jobData = res[0];
    }).then(queryEmployees().then((res2) => {
        return empData = res2[0];
    }).then(() => {
        const jobArray = [];
        const managerArray = ['None'];
        jobData.forEach((element) => {
            jobArray.push(element.title);
        })
        empData.forEach((element) => {
            managerArray.push(element.first_name + " " + element.last_name);
        })
        inquirer.prompt([{
            type: 'input',
            message: 'Please enter first name of employee.',
            name : 'firstName',
            validate: (input) => {
                if (input) {return true}
                else {return 'Please enter a first name.'}
            }
        },
        {
            type: 'input',
            message: 'Please enter last name of employee.',
            name : 'lastName',
            validate: (input) => {
                if (input) {return true}
                else {return 'Please enter a last name.'}
            }
        },
        {
            type: 'list',
            message: 'What job does this employee have?',
            name : 'job',
            choices: jobArray,
        },
        {
            type: 'list',
            message: "Who is this employee's manager?",
            name : 'manager',
            choices: managerArray,
        }]).then((data) => {
            let jobObj
            jobData.forEach((element) => {
                if (element.title === data.job) {
                    jobObj = element;
                }
            })
            let managerObj
            empData.forEach((element) => {
                if (element.first_name + " " + element.last_name === data.manager) {
                    managerObj = element;
                }
            })
            insertEmployees(data, jobObj, managerObj);
            const newEmp = data.firstName + " " + data.lastName;
            console.log(`Added ${newEmp} to the database.`)
            init();
        })
        })
    )
}

function updateEmployee () {
    queryEmployees().then((res) => {
        const empList = res[0];
        const empArray = ['Exit'];
        empList.forEach((element) => {
            empArray.push(element.first_name + " " + element.last_name);
        })
        inquirer.prompt([{
            type: 'list',
            message: "Choose which employee's role needs to be updated",
            name: 'employee',
            choices: empArray,
        }]).then((data) => {
            let employeeObj
            if (data.employee === 'Exit') {
                console.log('Exiting')
                return init();
            } else {
            empList.forEach((elem) => {
                if (elem.first_name + " " + elem.last_name === data.employee) {
                    return employeeObj = elem
                }
            })
            queryJobs().then((res2) => {
                const roleUpdate = res2[0];
                const roleArray = ['Exit'];
                roleUpdate.forEach((elem2) => {
                    roleArray.push(elem2.title);
                })
            inquirer.prompt([{
                type: 'list',
                message: "What is the employee's new role?",
                name: 'role',
                choices: roleArray,
            }]).then((data2) => {
                if (data2.role === 'Exit') {
                    console.log('Exiting')
                    return init();
                } else {
                const jobObjArray = [];
                roleUpdate.forEach((elem3) => {
                    if (data2.role === elem3.title) {
                        jobObjArray.push(elem3);
                    }
                })
                updateEmployeeTable(employeeObj, jobObjArray);
                const empName = employeeObj.first_name + " " + employeeObj.last_name;
                console.log(`Changed ${empName}'s Role to ${jobObjArray[0].title}`);
                return init();
                }
                    })
                })
            }
        })
    })
}

function init () {
    inquirer.prompt(questions)
        .then((data) => {
            const choice = data.action;
            
            if (choice === 'View All Departments') {viewDepartments()}
            else if (choice === 'View All Roles') {viewRoles()}
            else if (choice === 'View All Employees') {viewEmployees()}
            else if (choice === 'Add Department') {addDepartment()}
            else if (choice === 'Add Role') {addRole()}
            else if (choice === 'Add Employee') {addEmployee()}
            else if (choice === 'Update Employee Role') {updateEmployee()}
            else if (choice === 'Exit') {console.log('Exiting now.'), process.exit()}
            else (console.log('There was an error.'), process.exit());
        })
};

init();