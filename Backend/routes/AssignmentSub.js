const express = require('express');
const mysql = require('mysql2');
const config = require('config');
const router = express.Router();
const multer = require('multer');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
const upload = multer({ storage:storage});

const connectionDetails = {
    host: config.get('host'),
    user: config.get('user'),
    password: config.get('password'),
    database: config.get('database'),
};



router.post('/upload', upload.single('file'), (req, res) => { 
    
    const connection  = mysql.createConnection(connectionDetails);
    connection.connect();
     const { 
        assignName, 
        assignDesc,
        publishDate,
        dueDate,
        courseId,
        subjectId,
        studentId } = req.body;
    const file = req.file.path; 
  
     const sql = ` INSERT INTO assignments (assignName, assignDesc, publishDate, dueDate, courseId, subjectId, studentId,file)
      VALUES (?, ?, ?, ?, ?, ?, ?,?)`;
 
      connection.query(sql, [assignName, assignDesc, publishDate, dueDate, courseId, subjectId, studentId,file], (error, result) => { 
        if (error) { console.error(error.message);
             return res.status(500).json({"status" : "error", "message" : 'Something Went Wrong...', 'errorMessage': error.message}); 
            } else 
            { 
                res.status(200).json({"status" : "success", "message" : 'Assignment Uploaded Successfully...'}); 
        } 
    });
    connection.end();
 });

  


    router.get('/assignment', (req, res) => {

        // const connection = pool;
        const connection  = mysql.createConnection(connectionDetails);
    connection.connect(); 
        const sql = `SELECT * FROM assignments`; 
        console.log(sql);
        
        connection.query(sql, (error, result) => { 
            if (error) { 
                console.log(error.message); 
                res.status(500).json({"status" : "error", "message" : 'Something Went Wrong...', 'errorMessage': error.message}); 
            }
             else 
             { 
                res.status(200).json({'status' : 'success', 'data' : result});
             }
        });
        connection.end();
    });


   




module.exports = router;
