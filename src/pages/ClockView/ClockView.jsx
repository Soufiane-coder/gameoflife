
import './ClockView.scss';
import ClockContainer from '../../components/ClockContainer/ClockContainer';
import SlideRoutine from '../../components/slide-routine/slide-routine.component';
import React, { useState, useEffect  }  from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentRoutines } from '../../redux/routines/routines.selector';
import PageHeader from '../../components/PageHeader/page-header';
import { isAmPm, getCurrentRoutine, hourMinFormat } from './utils';
import { 
    addNewToDoItemToFirebase,
    getTodoItemsOfRoutine ,
    changeTodoItemAttributesInFirebase,
    deleteAllToDoCheckedItemsFromFirebase} from '../../../lib/firebase';
import { selectCurrentUser } from '../../redux/user/user.selector';
import { Checkbox, Card, Row, Col, Button, Input} from 'antd';
import {DeleteOutlined, AppstoreAddOutlined} from '@ant-design/icons';

const ClockView = ({ user, routines }) => {
    const [loadingRoutines, setLoadingRoutines] = useState(true);
    const [todoList, setTodoList] = useState([])
    const [todoItemInput, setTodoItemInput ] = useState('')

    useEffect(() => {
        setLoadingRoutines(!routines);
        getTodoItemsOfRoutine(user.uid,).then(setTodoList)
    }, [routines])


    const [amPm, setAmPm] = useState({ ...isAmPm() });
    const [selectedRoutine, setSelectedRoutine] = useState('-2');

    const handleChangeCheckBox = () => {
        setAmPm(old => ({ am: !old.am, pm: !old.pm }))
    }

    const handleAddingTodoItem = (event) => {
        event.preventDefault()
        const newTodoItemId = addNewToDoItemToFirebase(user.uid, todoItemInput)
        setTodoList(old => ([...old, {todoItemId : newTodoItemId, description : todoItemInput, isAchieved: false}]))
        setTodoItemInput('')
    }

    const handleTodoItemInput = (event) => {
        const {target: {value}} = event
        setTodoItemInput(value)
    }

    const handleCheckTodoItem = (event) => {
        const {checked, id} = event.target
        const formatedId = id.split(':')[1]
        changeTodoItemAttributesInFirebase(user.uid, formatedId, checked)
        setTodoList(old => (
            old.map(todoItem => todoItem.todoItemId == formatedId ? {...todoItem, isAchieved : checked} : todoItem)))
    }

    const handleDeletingChekedItems = (event) => {
        event.preventDefault()
        deleteAllToDoCheckedItemsFromFirebase(user.uid,)
    }

    if (loadingRoutines) {
        return (
            <h1>loading Routines ...</h1>
        )
    }
    return (
        <>
            <PageHeader title={'Clock View'} />
            <div className='clock-view-page'>
                <ClockContainer routines={routines} setSelectedRoutine={setSelectedRoutine} {...amPm} />
                <div className="toggleWrapper">
                    <input type="checkbox" className="dn" id='dn' checked={amPm.pm} onChange={handleChangeCheckBox} />
                    <label htmlFor="dn" className="toggle">
                        <span className="toggle__handler">
                            <span className="crater crater--1"></span>
                            <span className="crater crater--2"></span>
                            <span className="crater crater--3"></span>
                        </span>
                        <span className="star star--1"></span>
                        <span className="star star--2"></span>
                        <span className="star star--3"></span>
                        <span className="star star--4"></span>
                        <span className="star star--5"></span>
                        <span className="star star--6"></span>
                    </label>
                </div>
                <SlideRoutine {...{ routines, selectedRoutine }} />
                
                <div>
                    <div className="clock-view-page__to-do-list">
                        <Card 
                            title='To do list'
                            onClick={handleAddingTodoItem}
                            extra={
                            <Button type='link'>
                                <AppstoreAddOutlined /> Add to-do item
                            </Button>}>
                            <Row gutter={[0, 0]}>
                                <Input placeholder='Write a description to your task'/>
                            </Row>
                            <Row gutter={[0, 0]}>
                                <Col span={21}>
                                    <Checkbox>a task to do</Checkbox>
                                </Col>
                                <Col span={1}>
                                    <Button
                                        type='text'
                                        danger
                                        >
                                        <DeleteOutlined onClick={() => console.log("fired")}/>
                                    </Button>
                                </Col>
                            </Row>
                        </Card>
                        {/* {
                            todoList?.map(todoItem => (
                                <React.Fragment key={todoItem.todoItemId}>
                                    <input onChange={handleCheckTodoItem} checked={todoItem.isAchieved}  id={"todo-item:"+ todoItem.todoItemId} type="checkbox"/>
                                    <label htmlFor={"todo-item:"+ todoItem.todoItemId}>{todoItem.description}</label>
                                </React.Fragment>
                            ))
                        } */}
                    </div>
                    {/* <div 
                        className='clock-view-page__add-todo-item-wrapper'
                        >
                        <Button 
                            onClick={handleAddingTodoItem}
                            // className='clock-view-page__add-todo-item-button'
                            type='primary'
                            color='green'
                            >Add a todo item</Button>
                        <input value={todoItemInput} onChange={handleTodoItemInput} className='clock-view-page__add-todo-item-input' type="text" />
                        {/* <button onClick={handleDeletingChekedItems}>Delete checked items</button>
                    </div> */}
                </div>
            </div>
        </>
    )
}

const mapPropsToMap = createStructuredSelector({
    user: selectCurrentUser,
    routines: selectCurrentRoutines
})

export default connect(mapPropsToMap)(ClockView);