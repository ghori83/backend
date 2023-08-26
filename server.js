const express =require("express")
const app = express()
const port = process.env.PORT || 8080;
require('dotenv').config();
const dbConfig = require('./config/dbConfig')
app.use(express.json());

const usersRoute = require('./routes/userRoute')
const inventoryRoute = require("./routes/inventoryRoute") 
const dashboardRoute = require('./routes/dashboardRoute')
app.use('/api/users', usersRoute);
app.use('/api/inventory',inventoryRoute)
app.use('/api/dashboard',dashboardRoute)
  

app.listen(port,() => console.log(`Nodejs Server Started At ${port}`));

//video is at 4.19