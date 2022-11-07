var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/employee', { useNewUrlParser: true });
var conn = mongoose.connection;


var employeeSchema = new mongoose.Schema({
    name: String,
    email: String,
    etype: String,
    hourlyrate: Number,
    totalHour: Number,
    total: Number
});

employeeSchema.methods.totalSalary = function () {
    return this.hourlyrate * this.totalHour;
}


var employeeModel = mongoose.model('Employee', employeeSchema);



module.exports = employeeModel;