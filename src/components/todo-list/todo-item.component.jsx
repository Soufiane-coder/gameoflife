
import { Fragment, useState } from "react";
import {Col, Checkbox, Button} from 'antd';
import {EditOutlined,LoadingOutlined, DeleteOutlined} from '@ant-design/icons'
import {changeTodoItemAttributesInFirebase,
    deleteToDoItemFromFirebase} from '../../../lib/firebase';
import { Popconfirm } from 'antd'

const ToDoItem = ({todoItem: thisToDoItem, setTodoList, user}) => {
    const [loadingDelete, setLoadingDelete] = useState(false)

    // const handleTodoItemInput = (event) => {
    //     const {target: {value}} = event
    //     setTodoItemInput(value)
    // }


    const handleCheckTodoItem = (event) => {
        const {checked} = event.target;

        changeTodoItemAttributesInFirebase(user.uid, thisToDoItem.todoItemId, checked)
        setTodoList(old => (
            old.map(todoItem => todoItem.todoItemId == thisToDoItem.todoItemId ? {...todoItem, isAchieved : checked} : todoItem)))
    }

    const handleDeleteItem = async () => {
        setLoadingDelete(true)
        try{
            await deleteToDoItemFromFirebase(user.uid, thisToDoItem.todoItemId)
            setTodoList(old => old.filter(todoItem => todoItem.todoItemId !== thisToDoItem.todoItemId))
        }
        catch(err){
            console.error(err)
        }
        finally{
            setLoadingDelete(false)
        }
    }

    const cancelDelete = (event) => {
        console.error('Click on no')
    }
    return (
        <>
            <Col span={20}>
                <Checkbox
                    checked={thisToDoItem.isAchieved}
                    onChange={handleCheckTodoItem}
                >{thisToDoItem.description}</Checkbox>
            </Col>
            <Col  span={2}>
                <Button
                    type="text"
                    color=''
                    >
                    <EditOutlined />
                </Button>
            </Col>
            <Col span={2}>
                <Popconfirm
                    title='Delete the task'
                    description='Are you sure to delete this task'
                    onConfirm={handleDeleteItem}
                    onCancel={cancelDelete}
                    okText='Yes'
                    cancelText='No'
                    >
                    <Button
                        type='text'
                        // loading={loadingDelete}
                        danger
                        >
                        {
                            loadingDelete ? <LoadingOutlined/> : <DeleteOutlined />
                        }
                    </Button>
                </Popconfirm>
            </Col>
            
        </>
    )
}

export default ToDoItem;