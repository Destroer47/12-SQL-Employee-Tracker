INSERT INTO departments (name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal"),
       ("Business");

INSERT INTO jobs (title, salary, department_id)
VALUES ("Salesperson", 70000, 1), 
       ("Lead Engineer", 120000, 2),
       ("Software Engineer", 100000, 2),
       ("Account Manager", 140000, 3),
       ("Accountant", 110000, 3),
       ("Legal Team Lead", 200000, 4),
       ("Lawyer", 160000, 4),
       ("CEO", 500000, 5),
       ("COO", 250000, 5);

INSERT INTO employees (first_name, last_name, job_id, manager_id)
VALUES ("Joe", "Schmoe", 8, null),
       ("Billy", "Joel", 9, 1);