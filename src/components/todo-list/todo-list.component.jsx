import { Card, Row,  Button, Input,} from 'antd';
import {DeleteOutlined, AppstoreAddOutlined, LoadingOutlined} from '@ant-design/icons';
import { 
    addNewToDoItemToFirebase,
    getTodoItemsOfRoutine ,
    changeTodoItemAttributesInFirebase,
    deleteToDoItemFromFirebase} from '../../../lib/firebase';
import { useEffect, useState,} from 'react';
import ToDoItem from './todo-item.component';
import './todo-list.style.scss';


const ToDoList = ({user}) => {

    const [todoList, setTodoList] = useState([])
    const [todoItemInput, setTodoItemInput ] = useState('')
    

    useEffect(() => {
        getTodoItemsOfRoutine(user.uid,).then(setTodoList)
    },[])

    const handleAddingTodoItem = (event) => {
        event.preventDefault()
        const newTodoItemId = addNewToDoItemToFirebase(user.uid, todoItemInput)
        setTodoList(old => ([...old, {todoItemId : newTodoItemId, description : todoItemInput, isAchieved: false}]))
        setTodoItemInput('')
    }


    return(
        <div className="clock-view-page__to-do-list">
            <Card 
                title='To do list'
                extra={
                <Button
                    type='link'
                    onClick={handleAddingTodoItem}
                    >
                    <AppstoreAddOutlined /> Add to-do item
                </Button>}>
                <Row gutter={[0, 0]}>
                    <Input 
                        placeholder='Write a description to your task'
                        onChange={(event) => setTodoItemInput(event.target.value)}
                        value={todoItemInput}
                    />
                </Row>
                <Row gutter={[0, 0]}>
                    {todoList?.map((todoItem, key) => (
                            <ToDoItem 
                                {...{todoItem, setTodoList, user, key}}/>
                    ))}
                </Row>
            </Card>
        </div>
    )
}

export default ToDoList