import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export const CreateTasks = () => {

  const navigate = useNavigate()

  const [users, setUsers] = useState([])
  const [types, setTypes] = useState([])



  useEffect(
    () => {
      fetch(`http://localhost:8088/types?_sort=name`)
        .then(response => response.json())
        .then((typesArray) => {
          setTypes(typesArray)
        })


    },
    []
  )

  useEffect(
    () => {
      fetch(`http://localhost:8088/users?_sort=fullName`)
        .then(response => response.json())
        .then((usersArray) => {
          setUsers(usersArray)
        })


    },
    []
  )

  // This module will create a new task by updating/POST to database directly

  /*
    assignments: [
      {
        id: int,
        userId: int,
        taskId: int
      }
    ],

     tasks: [
      {

        userId: int,
        completion: boolean,
        instructions: "",
        typeId: int
      }
    ]
  */

  //initial state of newTasks will provide the following information:
  const [newTasks, setNewTasks] = useState({
    userId: 0,
    completion: false,
    instructions: "",
    typeId: 0
  })


  const createNewTasks = (event) => {
    event.preventDefault()

    const newTaskDatabase = {
      userId: parseInt(newTasks.userId),
      completion: false,
      instructions: newTasks.instructions,
      typeId: parseInt(newTasks.typeId)
    }

    const newAssignmentDatabase = {
      userId: parseInt(newTasks.userId),
      //only need userId here.  taskId will be added in first POST.
    }


    fetch(`http://localhost:8088/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newTaskDatabase)
    })
      .then(response => response.json())
      .then((newTaskObject) => {
        //update updatedHire State...
        newAssignmentDatabase.taskId = newTaskObject.id //add taskId to newAssignmentDatabase

        fetch(`http://localhost:8088/assignments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newAssignmentDatabase)
        })
          .then(response => response.json())
          .then((newAssignmentUpdate) => {
            navigate("/tasks")
          }
          )
      }
      )
  }

  return (
    <form className="tasks__new-task">
      <h2 className="task__form-title">Assign New Task</h2>

      <fieldset>
        <div className="form-group">
          <label htmlFor="instructions"><strong>Enter Instructions Here:</strong></label>
          <textarea
            required autoFocus
            type="text"
            style={{ height: "10rem" }}
            className="form-control"
            placeholder="Enter Instructions..."
            value={newTasks.instructions}
            onChange={(evt) => {
              const copy = { ...newTasks }
              copy.instructions = evt.target.value
              setNewTasks(copy)
            }
            } />
        </div>
      </fieldset>

      <fieldset>
        <div><h3>Choose a Team Member: </h3></div>
        <select className="form-group"
          onChange={
            (evt) => {
              const copy = { ...newTasks }
              copy.userId = evt.target.value
              setNewTasks(copy)
            }
          }>
          {


          }
          <option value={0}>Assign a Team Member</option>
          {users.map(
            (user) => {
              return <option
                name="location"
                className="form-control dropdown"
                value={user.id}
                key={`user--${user.id}`}
              >{user.fullName}</option>
            }
          )}
        </select>
      </fieldset>

      <fieldset>
        <div><h3>Choose a Task Type </h3></div>
        <select className="form-group"
          onChange={
            (evt) => {
              const copy = { ...newTasks }
              copy.typeId = evt.target.value
              setNewTasks(copy)
            }
          }>
          <option value={0}>Tasks...</option>
          {types.map(
            (type) => {
              return <option
                name="type"
                className="form-control dropdown"
                value={type.id}
                key={`type--${type.id}`}
              >{type.name}</option>
            }
          )}
        </select>
      </fieldset>

      <button className="btn__new-task" onClick={(ClickEvent) => createNewTasks(ClickEvent)}>Create New Task</button>
      <button onClick={() => navigate("/tasks")}>Return to Task List</button>
    </form >
  )
}

