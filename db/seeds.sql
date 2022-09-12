USE employee_tracker_db;

INSERT INTO department (department_name)
VALUES ("Sales"),
        ("Legal"),
        ("Marketing"),
        ("Software");

INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Executive", 50000, 1),
        ("Sales Team Member", 23000, 1),
        ("Sales Consultant", 35000, 1),
        ("Graphics Technician", 40000, 2),
        ("Graphics Engineer", 50500, 2),
        ("figma", 30000, 2),
        ("software developer", 43000, 3),

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Bader", "Munir", 4, 1),
        ("Jayad", "Arshad", 1, 1),
        ("Aminah", "Hayyat", 2, 1),
        ("Frank", "Bruno", 2, 2),
        ("Chris", "Eubank", 3, 4),
        ("Mike", "Tyson", 3, 4),
        ("arnold", "Duck", 5, 2),
        ("jennifer", "Lawrence", 6, 7),
     
