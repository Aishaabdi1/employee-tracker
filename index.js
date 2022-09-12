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