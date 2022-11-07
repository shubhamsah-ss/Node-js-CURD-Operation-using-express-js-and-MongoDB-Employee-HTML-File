var express = require('express');
var multer = require('multer');
var path = require('path');
var empModel = require('../modules/employee');
var router = express.Router();
var uploadModel = require('../modules/upload');
var jwt = require('jsonwebtoken');
// router.use(express.static(path.join(__dirname, 'public')));

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');

}


function checkLogin(req, res, next){

  var myToken = localStorage.getItem('myToken');
  try {
    jwt.verify(myToken, 'loginToken');
  } catch(err) {
    res.send("You need to login");
  }
  next();
}

/* GET home page. */
router.get('/', checkLogin, function (req, res, next) {
  // employee.exec(function(err,data){
  //   if(err) throw err;
  //   res.render('index', { title: 'Employee Records', records: data });
  // })

  empModel.find({}, function (err, data) {
    if (!err) {
      res.render("index", { title: "Employee Records", records: data, success:'' });
    } else {
      throw err;
    }
  }).clone().catch(function (err) { console.log(err) });

});




// LOGIN 
router.get('/login', function (req, res, next) {
  

  var token = jwt.sign({ foo: 'bar' }, 'loginToken');
  localStorage.setItem('myToken', token);
  res.send("Logiin successfully");

});

// LOGOUT
router.get('/logout', function (req, res, next) {
  
  localStorage.removeItem('myToken');
  res.send("Logiout successfully");

 

});

//ADD employee
router.post('/', function (req, res, next) {
  var empDetails = new empModel({

    name: req.body.uname,
    email: req.body.email,
    etype: req.body.emptype,
    hourlyrate: req.body.hrlyrate,
    totalHour: req.body.ttlhr,
    total: parseInt(req.body.hrlyrate) * parseInt(req.body.ttlhr)

  });
  // console.log(empDetails);
  empDetails.save(function (err, res1) {
    // employee.exec(function(err,data){
    //   if(err) throw err;
    //   res.render('index', { title: 'Employee Records', records: data });
    // });
    empModel.find({}, function (err, data) {
      if (!err) {
        res.render("index", { title: "Employee Records", records: data, success: 'employee added successfully'});
      } else {
        throw err;
      }
    }).clone().catch(function (err) { console.log(err) });
  });




});


//FILTER employee
router.post('/search/', function (req, res, next) {

  var flrtName = req.body.fltrname;
  var flrtEmail = req.body.fltremail;
  var fltremptype = req.body.fltremptype;

  // var flterParameter={ $and:[{ name:flrtName},
  //   {$and:[{email:flrtEmail},{etype:fltremptype}]}
  //   ]
  //    }

  if(flrtName !='' && flrtEmail !='' && fltremptype !=''){

    var filterParameter={ $and:[{ name:flrtName},
      {$and:[{email:flrtEmail},{etype:fltremptype}]}
      ]
       }

  }else if(flrtName !='' && flrtEmail =='' && fltremptype !=''){

    var filterParameter = {
      $and: [ {name:flrtName}, {etype:fltremptype} ]
    }

  }else if(flrtName =='' && flrtEmail !='' && fltremptype !=''){

    var filterParameter = {
      $and: [ {email:flrtEmail}, {etype:fltremptype} ]
    }

  }else if(flrtName =='' && flrtEmail =='' && fltremptype !=''){

    var filterParameter = { etype:fltremptype }

  }else{
    var filterParameter = {}
  }


  empModel.find(filterParameter, function (err, data) {
    if (!err) {
      res.render("index", { title: "Employee Records", records: data, success:'' });
    } else {
      throw err;
    }
  }).clone().catch(function (err) { console.log(err) });





});


//DELETE employee
router.get('/delete/:id', function (req, res, next) {


  var id = req.params.id;
  empModel.findByIdAndDelete(id, function (err, data) {
    if (!err) {
      empModel.find({}, function (err, data) {
        if (!err) {
          res.render("index", { title: "Employee Records", records: data, success:'employee deleted successfully' });
        } else {
          throw err;
        }
      }).clone().catch(function (err) { console.log(err) })
      // res.redirect('/');
    } else {
      throw err;
    }
  }).catch(function (err) { console.log(err) })

});


//EDIT employee
router.get('/edit/:id', function (req, res, next) {


  var id = req.params.id;
  empModel.findById(id, function (err, data) {
    if (!err) {
      res.render("edit", { title: "Edit Employee Record", records: data});
    } else {
      throw err;
    }
  }).clone().catch(function (err) { console.log(err) })

});


//UPDATE employee
router.post('/update/', function (req, res, next) {

  // var dataRecords={
  //   name: req.body.uname,
  //     email: req.body.email,
  //     etype: req.body.emptype,
  //     hourlyrate: req.body.hrlyrate,
  //     totalHour: req.body.ttlhr,
  //     total: parseInt(req.body.hrlyrate) * parseInt(req.body.ttlhr),
    
  // };
  // var update= empModel.findByIdAndUpdate(req.body.id,dataRecords);
  // update.exec(function(err,data){
  // if(err) throw err;
  // employee.exec(function(err,data){
  //   if(err) throw err;
  //   res.redirect("/");  });
  //   });

  var id = req.body.empid;
  
  empModel.findByIdAndUpdate(id, { 
    name: req.body.uname, 
    email: req.body.email,
    etype: req.body.emptype,
    hourlyrate: req.body.hrlyrate,
    totalHour: req.body.ttlhr,
    total: parseInt(req.body.hrlyrate) * parseInt(req.body.ttlhr) 
    }, function (err, data) {
    if (!err) {
      // res.redirect('/');
      empModel.find({}, function (err, data) {
        if (!err) {
          res.render("index", { title: "Employee Records", records: data, success:'employee updated successfully' });
        } else {
          throw err;
        }
      }).clone().catch(function (err) { console.log(err) })

    } else {
      throw err;
    }
  }).clone().catch(function (err) { console.log(err) })

});




//file/image
router.get('/upload', checkLogin, function (req, res, next) {
  uploadModel.find({}, function (err, data) {
    if (!err) {
      res.render("upload-file", { title: "Upload File", records: data, success: '' });
    } else {
      throw err;
    }
  }).clone().catch(function (err) { console.log(err) });
  
});






//UPLOAD file/image
router.use(express.static(__dirname + "./public"));

var Storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: (req, file, cb) =>{
    // cb(null, file.fieldname + "_" + Date.now()+path.extname(file.originalname));
    cb(null,file.originalname);

  }
});

var upload = multer({
  storage: Storage,
}).single('file');

//SAVE file/image
router.post('/upload', upload, function (req, res, next) {

  var fileName = req.file.filename;
  var success = req.file.filename + " uploaded successfully";

  var fileDetail = new uploadModel({

    fileName: fileName,
    date: Date.now()

  });

  fileDetail.save(function(err,doc){
    if (!err) {
      uploadModel.find({}, function (err, data) {
        if (!err) {
          res.render("upload-file", { title: "Upload File", records: data, success: success });
        } else {
          throw err;
        }
      }).clone().catch(function (err) { console.log(err) });
    } else {
      throw err;
    }

  });

  
  
});






module.exports = router;
