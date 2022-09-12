// add dependicies
const { createPromptModule } = require("inquirer");
const inquirer = require("inquirer");
const db = require("./config/connection");

function start() {
    console.log("Welcome to the Employee Tracker.");
    Task();
  }
  
  function Task() {
    inquirer
      .prompt([
        {
          type: "list",
          name: "choice",
          message: "What would you like to do?",
          choices: [
            {
              name: "View All Departments",
              value: "viewDepartments",
            },
            {
              name: "View All Roles",
              value: "viewRoles",
            },
            {
              name: "View All Employees",
              value: "viewEmployees",
            },
            {
              name: "Create New Department",
              value: "newDepartment",
            },
            {
              name: "Create New Role",
              value: "newRole",
            },
            {
              name: "Add a New Employee",
              value: "newEmployee",
            },
            {
              name: "Update Employee's Role",
              value: "updateEmployeeRole",
            },
            {
              name: "EXIT",
              value: "close",
            }
          ],
        },
      ])
      .then((res) => {
        const choice = res.choice;
        switch (choice) {
          case "viewDepartments":
            viewDepartments();
            break;
          case "viewRoles":
            viewRoles();
            break;
          case "viewEmployees":
            viewEmployees();
            break;
          case "newDepartment":
            createDepartment();
            break;
          case "newRole":
            createRole();
            break;
          case "newEmployee":
            addEmployee();
            break;
          case "updateEmployeeRole":
            updateEmployeeRole();
            break;
          case "close":
            closeApp();
            break;
        }
      });
  }

function viewDepartments() {
    db.query("SELECT * FROM department", (err, data) => {
      if (err) throw err;
      console.table(data);
      selectTask();
    });
  }
  
  function viewRoles() {
    db.query(
      "SELECT roles.id, title, department.department_name AS department, salary FROM roles JOIN department ON roles.department_id = department.id",
      (err, data) => {
        if (err) throw err;
        console.table(data);
        selectTask();
      }
    );
  }
  
  function viewEmployees() {
    db.query(
      `SELECT employee.id, employee.first_name, employee.last_name, roles.title AS job_title, department.department_name AS department, concat(managers.first_name, " ", managers.last_name) AS manager FROM employee LEFT JOIN employee AS managers ON employee.manager_id = managers.id LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id`,
      (err, data) => {
        if (err) throw err;
        console.table(data);
        selectTask();
      }
    );
  }

  function createDepartment() {
    inquirer
      .prompt([
        {
          name: "name",
          message: "What would you like to call your new department?",
        },
      ])
      .then((res) => {
        const name = res.name;
        db.query(
          `INSERT INTO department (department_name) VALUES ("${name}")`,
          (err) => {
            if (err) throw err;
            console.log(`Department ${name} created.`);
            selectTask();
          }
        );
      });
  }

  function createRole() {
    // Fetch all departments
    db.query("SELECT * FROM department", (err, res) => {
      if (err) throw err;
      let department = res.map((departments) => ({
        name: departments.department_name,
        value: departments.id,
      }));
      inquirer
        .prompt([
          {
            type: "input",
            name: "name",
            message: "What would you like to call your new role?",
          },
          {
            type: "list",
            name: "department",
            message: "Which department does your new role belong to?",
            choices: department,
          },
          {
            type: "input",
            name: "salary",
            message: " expected salary for the new role?",
          },
        ])
        .then((answers) => {
          db.query(
            "INSERT INTO roles SET ?",
            {
              title: answers.name,
              salary: answers.salary,
              department_id: answers.department,
            },
            (err, res) => {
              if (err) throw err;
              console.log(
                `${answers.name} was successfully added to the database.`
              );
              selectTask();
            }
          );
        });
    });
  }


function addEmployee() {
    // Fetch list of the departments
    db.query("SELECT * FROM department", (err, res) => {
      if (err) throw err;
      let departments = res.map((department) => ({
        name: department.department_name,
        value: department.id,
      }));
  
      // Ask new employee name, then which department
      inquirer
        .prompt([
          {
            type: "input",
            name: "first_name",
            message: "What is your new employee's first name?",
          },
          {
            type: "input",
            name: "last_name",
            message: "What is your new employee's last name?",
          },
          {
            type: "list",
            name: "department",
            message: "Which department will your new employee belong to?",
            choices: departments,
          },
        ])
        .then((answer) => {
          let department = answer.department;
          let employee = {
            first_name: answer.first_name,
            last_name: answer.last_name,
          };
  
          // Query database for all roles from chosen department.
          db.query(
            `SELECT * FROM roles WHERE (department_id) = ("${department}")`,
            (err, res) => {
              if (err) throw err;
              let roles = res.map((role) => ({
                name: role.title,
                value: role.id,
              }));
  
              // Query Database for all staff
              db.query(
                `SELECT employee.id, employee.first_name, employee.last_name FROM employee JOIN roles ON employee.role_id = roles.id JOIN department ON roles.department_id = department.id WHERE department.id = "${department}"`,
                (err, res) => {
                  if (err) throw err;
                  let managers = res.map((manager) => ({
                    name: `${manager.first_name} ${manager.last_name}`,
                    value: manager.id,
                  }));
  
                  // Ask user which role and management to assign the new employee.
                  inquirer
                    .prompt([
                      {
                        type: "list",
                        name: "role_id",
                        message:
                          "Which role would you like to assign to this employee?",
                        choices: roles,
                      },
                      {
                        type: "list",
                        name: "manager_id",
                        message:
                          "Which member of this department would you like the new employee to report to?",
                        choices: managers,
                      },
                    ])
                    .then((answers) => {
                      // Insert new employee data
                      db.query(
                        "INSERT INTO employee SET ?",
                        {
                          first_name: employee.first_name,
                          last_name: employee.last_name,
                          role_id: answers.role_id,
                          manager_id: answers.manager_id,
                        },
                        (err, res) => {
                          if (err) throw err;
                          console.log(
                            `${employee.first_name} ${employee.last_name} was successfully added to the database.`
                          );
                          selectTask();
                        }
                      );
                    });
                }
              );
            }
          );
        });
    });
  }
  