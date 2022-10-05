import { useEffect, useState } from "react"
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import nashvilleYeah from "/Users/jeremymyers/workspace/done-capstone/src/IMG_0672.jpeg"
import logoOG from "/Users/jeremymyers/workspace/done-capstone/src/Done.Logo.OG.png"
import "./DeleteTask.css"

export const DeleteTasks = () => {


    const [types, setTypes] = useState([])
    const [users, setUsers] = useState([])

    const localDoneUser = localStorage.getItem("done_user")
    const doneUserObject = JSON.parse(localDoneUser)


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




    return <>
        {
            doneUserObject.admin
                ? <>
                    <Container>
                        <Row>
                            <Col>
                                <Form className="user__new-task jumbotron">
                                    <Form.Group>
                                        <Form.Label><strong>Family Members</strong></Form.Label>
                                        <ListGroup>
                                            {users.map(
                                                (user) => {
                                                    return <ListGroup.Item
                                                        name="location"
                                                        className="form-control dropdown"
                                                        value={user.id}
                                                        key={`user--${user.id}`}
                                                    >{user.fullName}
                                                        {
                                                            user.isAdmin && doneUserObject.admin
                                                                ? <>  <span className="text-danger">admin</span></>
                                                                : <></>
                                                        }
                                                    </ListGroup.Item>
                                                }
                                            )}
                                        </ListGroup>
                                    </Form.Group>
                                </Form>
                            </Col>
                            <Col>
                                <Form className="user__new-task jumbotron">
                                    <Form.Group>
                                        <Form.Label><strong>Types of Tasks</strong></Form.Label>
                                        <ListGroup>
                                            {types.map(
                                                (type) => {
                                                    return <ListGroup.Item
                                                        name="location"
                                                        className="form-control dropdown"
                                                        value={type.id}
                                                        key={`user--${type.id}`}
                                                    >{type.name}</ListGroup.Item>
                                                }
                                            )}
                                        </ListGroup>

                                    </Form.Group>
                                </Form>
                            </Col>
                            <Row>
                                <Form.Label >
                                    <h6 className="powered__by-bottom-base">Powered by  <img src={logoOG} className="" width="150" height="100" alt="Powered By Done Logo" /></h6>

                                </Form.Label>
                            </Row>
                        </Row>
                    </Container>
                </>
                : <>
                    <Container id="type__container" className="d-grid h-10">
                        <Row>
                            <figure className="position-relative">

                                <figcaption>
                                    {
                                        users.map(
                                            (user) => {
                                                if (doneUserObject.id === user.id)
                                                    return <Form.Label className="mb-4 fs-1" key={`user--${user.id}`}
                                                    ><strong><em>Welcome to  DONE<span>&#8253;</span> {user.fullName}</em></strong></Form.Label>
                                            })
                                    }</figcaption>

                                <img src={nashvilleYeah} className="img-fluid Nashville" width="1250" height="750" alt="Done Logo" />
                            </figure>
                        </Row>
                        <Row>

                            <Form.Label >
                                <h6 className="powered__by-bottom-base">Powered by  <img src={logoOG} className="" width="150" height="100" alt="Powered By Done Logo" /></h6>
                            </Form.Label>

                        </Row>
                    </Container>

                </>
        }
    </>
}