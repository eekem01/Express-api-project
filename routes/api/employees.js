const express = require('express');
const router = express.Router();
const employees = require('../../Employees');


// Endpoint to retrieve all employees
router.get('/', (req, res) => {
    res.json(employees);
});

// Endpoint to retrieve employee by id (numeric)
router.get('/:id(\\d+)', (req, res) => {
    const id = Number(req.params.id);
    const employee = employees.find(emp => emp.id === id);

    if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(employee);
});

// Endpoint to retrieve employee by name
router.get('/name/:name', (req, res) => {
    const employee = employees.find(e => e.name.toLowerCase() === req.params.name.toLowerCase());
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
});


// Endpoint to add new employee
router.post('/', (req, res) => {
    const { name, email, age, department } = req.body;

    const nameValid = typeof name === 'string' && name.trim().length > 0;
    const emailValid = typeof email === 'string' && email.includes('@');
    const departmentValid = typeof department === 'string' && department.trim().length > 0;
    const parsedAge = Number.parseInt(age, 10);
    const ageValid = Number.isInteger(parsedAge) && parsedAge > 0;

    if (!nameValid || !emailValid || !ageValid || !departmentValid) {
        return res.status(400).json({ message: 'Invalid or missing fields: name, email, age (>0), department' });
    }

    const maxId = employees.reduce((max, e) => (e.id > max ? e.id : max), 0);

    const newEmployee = {
        id: maxId + 1,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        age: parsedAge,
        department: department.trim(),
        added: new Date().toISOString()
    };

    employees.push(newEmployee);
    res.status(201).json(newEmployee);
});


// Endpoint to update an employee by id (numeric)
router.put('/:id(\\d+)', (req, res) => {
    const id = Number(req.params.id);
    const { name, email, age, department } = req.body;

    const employee = employees.find(emp => emp.id === id);

    if (!employee) {
        return res.status(404).json({ message: 'Employee does not exist' });
    }

    if (name !== undefined) {
        if (typeof name !== 'string' || name.trim().length === 0) {
            return res.status(400).json({ message: 'Invalid name' });
        }
        employee.name = name.trim();
    }

    if (email !== undefined) {
        if (typeof email !== 'string' || !email.includes('@')) {
            return res.status(400).json({ message: 'Invalid email' });
        }
        employee.email = email.trim().toLowerCase();
    }

    if (age !== undefined) {
        const parsedAge = Number.parseInt(age, 10);
        if (!Number.isInteger(parsedAge) || parsedAge <= 0) {
            return res.status(400).json({ message: 'Invalid age' });
        }
        employee.age = parsedAge;
    }

    if (department !== undefined) {
        if (typeof department !== 'string' || department.trim().length === 0) {
            return res.status(400).json({ message: 'Invalid department' });
        }
        employee.department = department.trim();
    }

    employee.updated = new Date().toISOString();

    res.json({ message: 'Employee updated', employee });
});


// Endpoint to update an existing employee by name
router.put('/name/:name', (req, res) => {
    const { name } = req.params;
    const { newName, email, age, department } = req.body;

    const employee = employees.find(emp => emp.name.toLowerCase() === name.toLowerCase());

    if (!employee) {
        return res.status(404).json({ message: 'Employee does not exist' });
    }

    if (newName !== undefined) {
        if (typeof newName !== 'string' || newName.trim().length === 0) {
            return res.status(400).json({ message: 'Invalid newName' });
        }
        employee.name = newName.trim();
    }

    if (email !== undefined) {
        if (typeof email !== 'string' || !email.includes('@')) {
            return res.status(400).json({ message: 'Invalid email' });
        }
        employee.email = email.trim().toLowerCase();
    }

    if (age !== undefined) {
        const parsedAge = Number.parseInt(age, 10);
        if (!Number.isInteger(parsedAge) || parsedAge <= 0) {
            return res.status(400).json({ message: 'Invalid age' });
        }
        employee.age = parsedAge;
    }

    if (department !== undefined) {
        if (typeof department !== 'string' || department.trim().length === 0) {
            return res.status(400).json({ message: 'Invalid department' });
        }
        employee.department = department.trim();
    }

    employee.updated = new Date().toISOString();

    res.json({ message: 'Employee updated', employee });

});


// Endpoint to delete an existing employee by id

router.delete('/:id(\\d+)', (req, res) => {
    const id = Number(req.params.id);
    const index = employees.findIndex(emp => emp.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Employee does not exist' });
    }

    employees.splice(index, 1);
    res.json({ message: 'Employee deleted' });
});


// Endpoint to delete an employee by name
router.delete('/name/:name', (req, res) => {
    const { name } = req.params;
    const index = employees.findIndex(emp => emp.name.toLowerCase() === name.toLowerCase());

    if (index === -1) {
        return res.status(404).json({ message: 'Employee does not exist' });
    }

    employees.splice(index, 1);
    res.json({ message: 'Employee deleted' });
});
 



module.exports = router;