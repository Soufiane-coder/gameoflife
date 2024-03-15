import React, { useEffect } from 'react'
import TimeRecorderPage from '../../components/time-recorder/time-recorder.component'
import ToDoList from '../../components/todo-list/todo-list.component'
import './focus-mode.style.scss'
import {useParams} from 'react-router-dom'
import { Card } from 'antd'
import { createStructuredSelector } from 'reselect'
import { selectCurrentUser } from '../../redux/user/user.selector'
import { connect , ConnectedProps} from 'react-redux'

const mapStateToProps = createStructuredSelector({
  user: selectCurrentUser
})

const connector = connect(mapStateToProps)

export type PropsFromRedux = ConnectedProps<typeof connector>

const FocusModePage : React.FC<PropsFromRedux> = ({user}) => {
  const {routineId} = useParams()

  return (
    <div className='focus-mode-page'>
      <TimeRecorderPage user={user}/>
      <ToDoList user={user}/>
    </div>
  )
}

export default connector(FocusModePage)
