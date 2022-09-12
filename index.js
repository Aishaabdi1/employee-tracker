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