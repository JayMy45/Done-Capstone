import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Form from "react-bootstrap/Form"
import Container from "react-bootstrap/Container"
import Button from "react-bootstrap/Button"
import "./Create.css"

export const UserCreateTasks = () => {

    const navigate = useNavigate()

    const [users, setUsers] = useState([])
    const [types, setTypes] = useState([])

    const localDoneUser = localStorage.getItem("done_user")
    const doneUserObject = JSON.parse(localDoneUser)

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
            fetch(`http://localhost:8088/users`)
                .then(response => response.json())
                .then((usersArray) => {
                    setUsers(usersArray)
                })


        },
        []
    )

    // This module will create a new task by updating/POST to database directly

    /*
      "assignments": [
        {
          "id": 1,
          "userId": 3,
          "taskId": 1
        },
    
        Tasks
        {
          "id": 1,
          "userId": 3,
          "completion": false,
          "instructions": "Rinse dishes after scrapping food and debris.  Then load dishwasher.  Use new pouches under the sink.  Be sure to wash my lunch bowl and Yeti cup.",
          "typeId": 1
        },
    
          "types": [
        {
          "id": 1,
          "name": "Clean Kitchen",
          "locationId": 2
        },
    "location"
           {
          "id": 1,
          "location": "Bedroom"
        },
    
    
    */

    //initial state of newTasks will provide the following information:
    const [newTasks, setNewTasks] = useState({
        userId: doneUserObject.id,
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
        <Container id="task__container">
            < Form className="tasks__new-task" >
                <h2 className="task__form-title mb-3 text-center">Create A New Tasks</h2>

                <div className="user__assigned">

                    <div>
                        <Form.Label className="user__assigned--task mb-1">Assigned To:</Form.Label>
                    </div>
                    <Form.Group>
                        {
                            users.map(
                                (user) => {
                                    if (doneUserObject.id === user.id)
                                        return <Form.Label className="mb-4 fs-1" key={`user--${user.id}`}
                                        ><strong>{user.fullName}</strong></Form.Label>
                                })
                        }
                    </Form.Group>
                </div>
                <Form.Group>
                    <div className="form-group">
                        <Form.Label >Enter Instructions Below:</Form.Label>
                        <Form.Control
                            as="textarea"
                            required autoFocus
                            style={{ height: "10rem" }}
                            className="form-control mb-4"
                            placeholder="Enter Instructions..."
                            value={newTasks.instructions}
                            onChange={(evt) => {
                                const copy = { ...newTasks }
                                copy.instructions = evt.target.value
                                setNewTasks(copy)
                            }
                            } />
                    </div>
                </Form.Group>
                <Form.Group>
                    <fieldset>
                        <Form.Label>Choose a Task Type </Form.Label>
                        <Form.Select className="form-group mb-3"
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
                        </Form.Select>
                    </fieldset>
                </Form.Group>
                <div className="mb-2 d-grid"><Button className="btn__new-task" variant="success" onClick={(ClickEvent) => createNewTasks(ClickEvent, users.id)}>Assign New Task</Button></div>
                <div className="d-grid"><Button type="button" onClick={() => navigate("/tasks")}>Return to Task List</Button></div>
            </Form >
        </Container >
    )
}

