const config = require('config.json');
const { Op } = require('sequelize');
const db = require('_helper/db');

module.exports = {
    getByEmployeeId,
    create,
    update,
    getAll,
    getById
};

async function getAll() {
    const workflows = await db.Workflow.findAll({
        include: [{
            model: db.Employee,
            as: 'employee',
            include: [{
                model: db.Account,
                as: 'account',
                attributes: ['email', 'firstName', 'lastName']
            }]
        }]
    });
    return workflows.map(workflow => workflowDetails(workflow));
}

async function getById(id) {
    const workflow = await getWorkflow(id);
    return workflowDetails(workflow);
}

async function getByEmployeeId(employeeId) {
    const workflows = await db.Workflow.findAll();
    return workflows.map(workflow => workflowDetails(workflow));
}

async function create(params) {
    // Validate employee exists
    const employee = await db.Employee.findByPk(params.employeeId);
    if (!employee) throw 'Employee not found';

    const workflow = new db.Workflow(params);
    await workflow.save();
    return workflowDetails(workflow);
}

async function update(id, params) {
    const workflow = await getWorkflow(id);
    
    // Validate status transition
    if (params.status && !isValidStatusTransition(workflow.status, params.status)) {
        throw 'Invalid status transition';
    }

    Object.assign(workflow, params);
    await workflow.save();
    return workflowDetails(workflow);
}

async function getWorkflow(id) {
    const workflow = await db.Workflow.findByPk(id, {
        include: [{
            model: db.Employee,
            as: 'employee',
            include: [{
                model: db.Account,
                as: 'account',
                attributes: ['email', 'firstName', 'lastName']
            }]
        }]
    });
    if (!workflow) throw 'Workflow not found';
    return workflow;
}

function workflowDetails(workflow) {
    const { id, type, status, employeeId, createdAt, updatedAt, employee } = workflow;
    return {
        id,
        type,
        status,
        employeeId,
        createdAt,
        updatedAt,
        employee: employee ? {
            id: employee.id,
            position: employee.position
        } : null
    };
}

function isValidStatusTransition(currentStatus, newStatus) {
    const validTransitions = {
        'Pending': ['Approved', 'Rejected'],
        'Approved': [],
        'Rejected': []
    };
    return validTransitions[currentStatus].includes(newStatus);
}



