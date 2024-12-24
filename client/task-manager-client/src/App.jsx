import React from "react"
import TaskList from "./components/TaskList"
import './App.css'


function App() {

  const [tasks,setTasks] = React.useState([]);
  const [editState,setEditState] = React.useState(false)

  async function addTaskDB(new_task){
    console.log(new_task);
    try{
      const response = await fetch("/api/addTask",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({name: new_task, completed: false}),
      });

     

      if(response.ok){
        console.log("Task added");
        fetchTasks();
      }
      else{
        console.error("Error!")
      }
    } catch(error){
      console.error(error);
    }
  }

  async function fetchTasks(){
    try{
      const response = await fetch("/api/readTask");
      const data = await response.json();

      if(response.ok){
        console.log("Successfully fetched Tasks!");
        console.log(data);
        setTasks(data);
      }
      else{
        console.error("Error!");
      }
    } catch(error){
      console.error(error);
    }
  }

  function addTask(event){
    event.preventDefault();
    const formData = new FormData(event.target);
    const new_task = formData.get("user-task");
    addTaskDB(new_task);
  }

  async function handleDelete(taskID){
    try{
      const response = await fetch("/api/deleteTask", {
        method: "DELETE",
        headers: {"Content-Type": "application/json",
      },
      body: JSON.stringify({id: taskID})
      });

      if (response.ok){
        console.log("Task Deleted!");
        fetchTasks();
      }
      else{
        console.error("Error!");
      }
    }catch(err){
      console.error(err);
    }
  }

  React.useEffect(() => {
    fetchTasks();
  }, []);

  function handleEdit(){
    setEditState(prevEditState => !prevEditState);
  }

  async function updateTask(taskID,newTaskName){
    try{
      response = await fetch("/api/updateTask", {
        method: "POST",
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({id: taskID, newName: newTaskName})
      });

      if (response.ok){
        console.log("Updated Task!");
        fetchTasks();
      }
      else{
        console.log("Error!");
      }

    }catch(err){
      console.error(err);
    }
  }

  return (
    <div>
      <h1>Task Manager</h1>


      <section>
        <form onSubmit = {addTask}>
          <label>Enter Task: </label>
          <input
          name = "user-task"
          type = "text"
          placeholder="i.e. Take out trash"
          />
        </form>
      </section>

      <section>
        {tasks.length > 0 && <TaskList tasks = {tasks} handleDelete = {handleDelete} handleEdit = {handleEdit} 
        editState = {editState} updateTask = {updateTask}/>}
      </section>
    </div>
  )
}

export default App
