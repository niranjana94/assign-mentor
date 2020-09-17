const express = require('express');
const app = express();
const mongodb = require('mongodb');
const mongoclient = mongodb.mongoclient;
const url = "mongodb+srv://m001-student:8FVGTLPp6xBplNdw@sandbox.pzv6n.mongodb.net?retryWrites=true&w=majority"

const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const cors=require('cors')

app.use(bodyParser.json())

app.use(cors({
    origin:"http://127.0.0.1:5500"
}))

var students =[];
var mentors =[];

app.get("/", async function (req, res) {
    res.json("Hello World");
});

app.get('/students',async function(req,res){
    try {
        let client = await MongoClient.connect(url);
        let db = client.db('mentorstudentdetails');
        let students = await db.collection('students').find().toArray();        
        client.close();
        res.json(students);
    } catch (error) {
        console.log(error);
        res.json({
            message:"Something went wrong"
        })
    }
    
})


app.post('/student',async function(req,res){
    try {
        let client = await MongoClient.connect(url);
        let db = client.db('mentorstudentdetails');
        let insertedstudent = await db.collection('students').insertOne({name:req.body.name,mentorid:req.body.mentorid});
        //console.log(insertedstudent.insertedId);
        client.close();
        res.json({id:insertedstudent.insertedId,
                   details:insertedstudent});
    } catch (error) {
        res.json({
            message:"Something went wrong"
        })
    }  

})

app.put('/student/:id',async function(req,res){
    try {
        let client = await MongoClient.connect(url);
        let db = client.db('mentorstudentdetails');       
                
        await db.collection('students').findOneAndUpdate({_id:mongodb.ObjectID(req.params.id)},{$set:{mentorid:req.body.mentorid}});
                 
        client.close();
        res.json();
    } catch (error) {
        res.json({
            message:"Something went wrong"
        })
    }  
})


app.get('/mentors',async function(req,res){
    try {
        let client = await MongoClient.connect(url);
        let db = client.db('mentorstudentdetails');
        let mentors = await db.collection('mentors').find().toArray();        
        client.close();
        res.json(mentors);
    } catch (error) {
        res.json({
            message:"Something went wrong"
        })
    }
    
})


app.post('/mentor',async function(req,res){
    try {
        let client = await MongoClient.connect(url);
        let db = client.db('mentorstudentdetails');
        let newmentor = await db.collection('mentors').insertOne({name:req.body.name,studentid:req.body.studentid});
        //console.log(insertedstudent.insertedId);
        client.close();
        res.json({id:newmentor.insertedId,
                   details:newmentor});
    } catch (error) {
        res.json({
            message:"Something went wrong"
        })
    }  

})

app.put('/mentor/:id',async function(req,res){
    try {
        let client = await MongoClient.connect(url);
        let db = client.db('mentorstudentdetails');
        //let mentors_nostudent = db.mentors.find( { studentid: { $exists: false } } );
        var studentID =[];
       // if(mentors_nostudent)
       // {     
            studentID.push(req.body.studentid);
           await db.collection('mentors').findOneAndUpdate({_id:mongodb.ObjectID(req.params.id)},{$set:{studentid:studentID}});
       // }
        
        //console.log(insertedstudent.insertedId);
        client.close();
        res.json();
    } catch (error) {
        console.log(error);
        res.json({
            message:"Something went wrong"
        })
    }  
})

app.get('/mentor/:id',async function(req,res){
    try {
        let client = await MongoClient.connect(url);
        let db = client.db('mentorstudentdetails');
        /*let mentors_student = await db.mentors.find(
            {$or: [
                {_id:mongodb.ObjectID(req.params.id)},{ 'studentid':{$exists: true, $ne: null }}
             ]} ).toArray();*/
       
        //console.log(insertedstudent.insertedId);
        var result=[];
        let mentors = await db.collection('mentors').findOne({_id:mongodb.ObjectID(req.params.id)});   
       // console.log(mentors["studentid"])  ;
        for(let i of mentors["studentid"])
        {
            //console.log(i)
            let val= await db.collection('students').findOne(mongodb.ObjectID(i));
            result.push(val["name"]);
        }      
       
        client.close();
       // console.log(result);
        res.json(result);
       
    } catch (error) {
        console.log(error);
        res.json({
            message:"Something went wrong"
        })
    }  
})


app.listen(process.env.PORT || 3030,function(){
    console.log('server started');
})
