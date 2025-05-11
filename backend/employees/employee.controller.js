const express = require('express');
const router = express.Router();
const Joi = require('joi');
const employeeService = require('./employee.service');


const authorize = require('_middleware/authorize');
const validateRequest = require('_middleware/validate-request');
const Role = require('_helper/role');

// Routes
router.get('/', authorize(Role.Admin), getAll);
router.get('/:id', authorize(), getById);
router.post('/', authorize(Role.Admin), createSchema, create);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);
router.post('/transfer', authorize(Role.Admin), transferSchema, transfer);

// Schemas
function createSchema(req, res, next) {
    const schema = Joi.object({
        employeeId: Joi.string().required(),
        position: Joi.string().required(),
        departmentId: Joi.number(),
        hireDate: Joi.date().required(),
        isActive: Joi.boolean().default(true),
        accountId: Joi.number().required()
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        position: Joi.string().optional(),
        departmentId: Joi.number().optional(),
        hireDate: Joi.date().optional(),
        isActive: Joi.boolean().optional(),
        accountId: Joi.number().optional()
    });
    validateRequest(req, next, schema);
}

function transferSchema(req, res, next) {
    const schema = Joi.object({
        employeeId: Joi.number().required(),
        newDepartmentId: Joi.number().required()
    });
    validateRequest(req, next, schema);
}

// Handlers
function getAll(req, res, next) {
    employeeService.getAll()
        .then(employees => res.json(employees))
        .catch(next);
}

function getById(req, res, next) {
    employeeService.getById(req.params.id)
        .then(employee => res.json(employee))
        .catch(next);
}

function create(req, res, next) {
    employeeService.create(req.body)
        .then(employee => res.status(201).json(employee))
        .catch(next);
}

function update(req, res, next) {
    employeeService.update(req.params.id, req.body)
        .then(employee => res.json(employee))
        .catch(next);
}

function _delete(req, res, next) {
    employeeService._delete(req.params.id)
        .then(() => res.json({ message: 'Employee deleted successfully' }))
        .catch(next);
}

async function transfer(req, res, next) {
    try {
        const { employeeId, newDepartmentId } = req.body;
        
        if (!employeeId || !newDepartmentId) {
            return res.status(400).json({ message: 'Employee ID and new department ID are required' });
        }
        
        const updatedEmployee = await employeeService.transferEmployee(employeeId, newDepartmentId);
        res.json(updatedEmployee);
    } catch (error) {
        next(error);
    }
}

module.exports = router;
