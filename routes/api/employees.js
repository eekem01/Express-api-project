const express = require('express');
const router = express.Router();
const moment = require('moment');
const employees = require('../../Employees');

// List all employees
router.get('/', (req, res) => {
  res.json(employees);
});

// Get employee by ID
router.get('/id/:id', (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    return res.status(400).json({ message: 'Invalid id' });
  }
  const employee = employees.find(emp => emp.id === id);
  if (!employee) {
    return res.status(404).json({ message: 'Employee not found' });
  }
  res.json(employee);
});

// Get employee by name (case-insensitive)
router.get('/name/:name', (req, res) => {
  const { name } = req.params;
  const employee = employees.find(e => e.name.toLowerCase() === name.toLowerCase());
  if (!employee) {
    return res.status(404).json({ message: 'Employee not found' });
  }
  res.json(employee);
});

// Create a new employee
router.post('/', (req, res) => {
  const { name, email, age, department } = req.body;
  if (!name || !email || !age || !department) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  const newEmployee = {
    id: employees.reduce((maxId, e) => (e.id > maxId ? e.id : maxId), 0) + 1,
    name,
    email,
    age,
    department,
    added: moment().format('YYYY-MM-DD HH:mm:ss')
  };
  employees.push(newEmployee);
  res.status(201).json(newEmployee);
});

// Update an existing employee by ID
router.put('/id/:id', (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    return res.status(400).json({ message: 'Invalid id' });
  }
  const employee = employees.find(emp => emp.id === id);
  if (!employee) {
    return res.status(404).json({ message: 'Employee does not exist' });
  }
  const { name, email, age, department } = req.body;
  if (name) employee.name = name;
  if (email) employee.email = email;
  if (age) employee.age = age;
  if (department) employee.department = department;
  employee.updated = moment().format('YYYY-MM-DD HH:mm:ss');
  res.json({ message: 'Employee updated', employee });
});

// Update an existing employee by name
router.put('/name/:name', (req, res) => {
  const { name } = req.params;
  const employee = employees.find(emp => emp.name.toLowerCase() === name.toLowerCase());
  if (!employee) {
    return res.status(404).json({ message: 'Employee does not exist' });
  }
  const { newName, email, age, department } = req.body;
  if (newName) employee.name = newName;
  if (email) employee.email = email;
  if (age) employee.age = age;
  if (department) employee.department = department;
  employee.updated = moment().format('YYYY-MM-DD HH:mm:ss');
  res.json({ message: 'Employee updated', employee });
});

// Delete by ID
router.delete('/id/:id', (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    return res.status(400).json({ message: 'Invalid id' });
  }
  const index = employees.findIndex(emp => emp.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Employee does not exist' });
  }
  employees.splice(index, 1);
  res.json({ message: 'Employee deleted' });
});

// Delete by name
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