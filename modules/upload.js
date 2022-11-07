var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/employee', { useNewUrlParser: true });
var conn = mongoose.connection;

var uploadSchema = new mongoose.Schema({

    fileName: String,
    date: Date
});

var uploadModel = mongoose.model('upload-file', uploadSchema);


module.exports = uploadModel;
