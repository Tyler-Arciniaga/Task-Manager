import React from "react"

export default function TaskList(props){
    const [taskNames,setTaskNames] = React.useState(
        props.tasks.reduce((acc,task) => {
            acc[task._id] = task.title;
            return acc;
        }, {})
    );

    React.useEffect(() => {
        setTaskNames((prevTaskNames) => {
            const newTaskNames = {...prevTaskNames};
            props.tasks.forEach(task => {
                if(!newTaskNames[task._id]){
                    newTaskNames[task._id] = task.title;
                }
            });
            return newTaskNames;
        });
    }, [props.tasks]);

    const handleChange = (taskID,newTitle) =>{
        setTaskNames((prevTaskNames) => ({
            ...prevTaskNames,
            [taskID]: newTitle
        }));
    };


    const list_items = props.tasks.map(task => 
        (<li key = {task._id}>{task.title} 
        <button onClick={() => props.handleDelete(task._id)}>Mark Completed</button>
        </li>))

    const edit_items = props.tasks.map(task => 
        (<li key = {task._id}>
            <form onSubmit = {() => props.updateTask(task._id,taskNames[task._id])}>
                <input
                    type = "text"
                    value = {taskNames[task._id]}
                    onChange={(e) => handleChange(task._id,e.target.value)}
                />
            </form>
        </li>)
        )

    return (
        <section>
        <h2>Your Tasks</h2>
        <ul className = "tasks-list">
            {props.editState? edit_items: list_items}
        </ul>
        <button onClick={props.handleEdit}>Edit Tasks</button>
        </section>
    )
}