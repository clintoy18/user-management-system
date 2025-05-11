const config = require('config.json');
const { Op } = require('sequelize');
const db = require('_helper/db');
const { get } = require('http');


module.exports = {
    getAll,
    getById,
    create,
    update, 
    _delete,
    // getByEmail,
    employeeDetails,
    transferEmployee,
}



async function getAll() {
    const employees = await db.Employee.findAll();
    const detailedEmployees = await Promise.all(employees.map(emp => employeeDetails(emp)));
    return detailedEmployees;

}

async function getById(id) {
    const employee = await getEmployee(id);
    return employeeDetails(employee);
}

async function employeeDetails(employee) {
    const { id, employeeId, position, departmentId, hireDate, isActive, accountId } = employee;

    // get account details 
    let account = null;
    try {
        account = await employee.getAccount();    
    } catch (error) {
        account = null; 
    }

    // get department details using the association
    let department = null;
    try {
        department = await employee.getDepartment();
    } catch (error) {
        department = null;
    }

    return {
        id,
        employeeId,
        position,
        departmentId,
        department: department ? department.name : null, // department name
        hireDate,
        isActive,
        accountId,
        account: account ? account.email : null // account email
    };
}


async function create(params){
    // validation
    if (!params.position) {
        throw 'Position is required';
    }
    if (!params.employeeId) {
        throw 'Employee ID is required';
    }
    // Check for duplicate employeeId
    if (await db.Employee.findOne({ where: { employeeId: params.employeeId } })) {
        throw 'Employee ID "' + params.employeeId + '" is already taken';
    }
    // Check for duplicate account assignment
    const existing = await db.Employee.findOne({ where :{accountId: params.accountId}});
    if(existing) throw 'This account is already assigned to an employee';

    // Check if account exists
    const account = await db.Account.findByPk(params.accountId);
    if (!account) throw 'Account does not exist. Please create an account first.';

    const employee = new db.Employee(params);
    // save employee
    await employee.save();
    return employeeDetails(employee);
}

async function update(id, params) {
    const employee = await getEmployee(id);

    // validate
    const emailChanged = params.email && employee.email !== params.email;
    if (emailChanged && await db.Employee.findOne({ where: { email: params.email } })) {
        throw 'Email "' + params.email + '" is already taken';
    }

    // copy params to employee and save
    Object.assign(employee, params);
    await employee.save();
    return employeeDetails(employee);
}


async function _delete(id){
    const employee = await getEmployee(id);
    await employee.destroy();

}

async function getEmployee(id){
    const employee = await db.Employee.findByPk(id);
    if (!employee) throw 'Employee not found';
    return employee;
}

async function transferEmployee(employeeId, newDepartmentId) {
    // Get the employee
    const employee = await getEmployee(employeeId);
    
    // Validate the new department exists
    const department = await db.Department.findByPk(newDepartmentId);
    if (!department) throw 'Department not found';
    
    // Update the employee's department
    employee.departmentId = newDepartmentId;
    await employee.save();
    
    return employeeDetails(employee);
}



