const express = require('express');
const router = express.Router();
const Joi = require('joi');
const workflowService = require('./workflows.services');
const authorize = require('_middleware/authorize');
const validateRequest = require('_middleware/validate-request');
const Role = require('_helper/role');

// Routes
router.get('/', authorize(Role.Admin), getAll);
router.get('/:id', authorize(), getById);
router.get('/employee/:employeeId', authorize(), getByEmployeeId);
router.post('/', authorize(Role.Admin), createSchema, create);
router.put('/:id', authorize(Role.Admin), updateSchema, update);

// Schemas
function createSchema(req, res, next) {
    const schema = Joi.object({
        type: Joi.string().valid('onboarding', 'transfer', 'termination', 'leave', 'other').required(),
        employeeId: Joi.number().required(),
        status: Joi.string().valid('Pending', 'Approved', 'Rejected').default('Pending')
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        type: Joi.string().valid('onboarding', 'transfer', 'termination', 'leave', 'other').optional(),
        employeeId: Joi.number().optional(),
        status: Joi.string().valid('Pending', 'Approved', 'Rejected').optional()
    });
    validateRequest(req, next, schema);
}

// Handlers
function getAll(req, res, next) {
    workflowService.getAll()
        .then(workflows => res.json(workflows))
        .catch(next);
}

function getById(req, res, next) {
    workflowService.getById(req.params.id)
        .then(workflow => res.json(workflow))
        .catch(next);
}

function getByEmployeeId(req, res, next) {
    workflowService.getByEmployeeId(req.params.employeeId)
        .then(workflows => res.json(workflows))
        .catch(next);
}

function create(req, res, next) {
    workflowService.create(req.body)
        .then(workflow => res.status(201).json(workflow))
        .catch(next);
}

function update(req, res, next) {
    workflowService.update(req.params.id, req.body)
        .then(workflow => res.json(workflow))
        .catch(next);
}

module.exports = router;
