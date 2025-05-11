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
    const { id, firstName, lastName, phoneNumber, address, position, departmentId, hireDate, salary, isActive, accountId } = employee;

    // get account details 
    let account = null;
    try{
        account = await employee.getAccount();    
    }
    catch (error) {
        account = null; 
       }
    return { id, firstName, lastName, phoneNumber, address, position, departmentId, hireDate, salary, isActive, accountId,
        account: {
            id: account.id,
            email: account.email,
            firstName: account.firstName,
            lastName: account.lastName,
            phoneNumber: account.phoneNumber,
            address: account.address,
            role: account.role,
            isActive: account.isActive
        
        } 
    };
     };


async function create(params){
    // validation
    if (!params.position) {
        throw 'Position is required';
    }
    
    const existing = await db.Employee.findOne({ where :{accountId: params.accountId}});
    if(existing) throw 'This account is already assigned to an employee'
   
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



