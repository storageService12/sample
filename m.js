const express=require('express');
const bodyParser=require('body-parser');
const {MongoClient}=require('mongodb');
const path=require('path');
const app=express();
const port=9200;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
const uri = "mongodb+srv://subikshas:84gxUqO6xiLSAwEU@cluster0.wwvda.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client=new MongoClient(uri);
app.get('/',(req,res) =>{
	res.sendFile(path.join(__dirname,'public','leaving.html'));
});

app.post('/add-data/' , async (req,res) => {
	try{
		const {name,room,phn,complaint}=req.body;
		await client.connect();
		const database=client.db('hostelmanaged');
		const collection=database.collection('students');
		const hostel={name,room,phn,complaint};
		await collection.insertOne(hostel);
		res.send("hostel details added successfully");
	}catch(err)
	{
		res.status(500).send('${error.message}');
	}
	finally{
		await client.close();
	}	
});

app.post('/update-data/' , async (req,res)=>{
	try{
		const {name,room,phn,complaint}=req.body;
		await client.connect();
		const database=client.db('hostelmanaged');
		const collection=database.collection('students');
		const result=await collection.updateOne(
		{name},{$set:{room,phn,complaint}});
		if(result.matchedCount > 0)
		{
			res.send("updated successfully");
		}
		else{
			res.send("error updating content");
		}
	}catch(err)
	{
	res.status(500).send(`${error.message}`);
	}
	finally{
		await client.close();
	}
});

app.post('/delete-data/' , async (req,res) =>{
	try{
		const {name,room,phn,complaint}=req.body;
		await client.connect();
		const database=client.db('hostelmanaged');
		const collection=database.collection('students');
		const result=await collection.deleteOne({name});
		if(result.deletedCount > 0)
		{
			res.send("deleted successfully");
		}
		else{
			res.send("error deleting content");
		}
	}catch(err)
	{
	res.status(500).send(`${error.message}`);
	}
	finally{
		await client.close();
	}	
});

app.post('/retrieve-data/' , async (req,res) =>{
	try{
		const {name,room,phn,complaint}=req.body;
		await client.connect();
		const database=client.db('hostelmanaged');
		const collection=database.collection('students');
		const hostel= await collection.findOne({name});
		if(hostel)
		{
			res.json(hostel);
		}
		else{
			res.send("error loading content");
		}
	}catch(err)
	{
	res.status(500).send(`${error.message}`);
	}
	finally{
		await client.close();
	}	
});

app.listen(port , ()=>{
	console.log(`server listening to port at http://localhost:${port}`);
});