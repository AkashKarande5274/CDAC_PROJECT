const express = require('express');
const config = require('config');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}))


var port = config.get('port');

const assignmentRoutes = require('./routes/AssignmentSub');
const FeesRoutes = require('./routes/FeeReciept');
const StudyMaterialroutes = require('./routes/StudyMaterial');
const Attendanceroutes = require('./routes/Attendance');

app.listen(port, () => { console.log(`Server Started on port ${port}...`);})

console.log("request comming....")

app.use('/students', assignmentRoutes);

app.use('/fees', FeesRoutes);
app.use('/doc', StudyMaterialroutes);
app.use('/proxy', Attendanceroutes);

      