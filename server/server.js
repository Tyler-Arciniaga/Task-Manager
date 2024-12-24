const express = require("express");
const mongoose = require("mongoose");
const port = 8000;
const app = express()

app.use(express.json());

dbURI = "mongodb+srv://tyarciniaga:testing1234@cluster0.sbuep.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(dbURI)

const taskSchema = new mongoose.Schema({
    title: String,
    completed: Boolean
});

const Task = mongoose.model("Task",taskSchema);

app.post("/api/addTask", async (req,res) => {
    try{
        const {name, completed} = req.body;

        const new_task = await Task.create({
            title: name,
            completed: completed
        });

        await new_task.save();

        console.log("added!")

        res.status(201).json({ message: 'Task added successfully', task: new_task });
    } catch(err){
        console.error(err);
        res.status(500).json({ message: 'Error adding task', error: err });
    }
});

app.get("/api/readTask", async(req,res) => {
    try{
        const userTasks = await Task.find({}).cursor().toArray();
        
        res.json(userTasks);

    } catch(err){
        console.error(err);
        res.status(500).json({ message: 'Error reading tasks ', error: err });
    }
})

app.delete("/api/deleteTask", async(req,res) => {
    try{
        const { id } = req.body;
        console.log("Deleting:", id);
        const deleted = await Task.findByIdAndDelete(id);

        if(!deleted){
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(201).json({ message: 'Task Deleted Successfully!'});
    } catch(err){
        console.error(err);
        res.status(500).json({ message: 'Error deleting task ', error: err });
    }
})

app.post("/api/updateTask", async(req,res) => {
    try{
        const { id,newName } = req.body;
        console.log("Updating:", id);
        const updated = await Task.findByIdAndUpdate(id, {title: newName});

        res.status(201).json({ message: 'Task Updated Successfully!'});
    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Error updating tasks ', error: err });

    }
})

app.listen(port, () =>{
    console.log(`Server running on http://localhost:${port}`);
})
