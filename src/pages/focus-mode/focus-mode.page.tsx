import React, { useEffect } from 'react'
import TimeRecorderPage from '../../components/time-recorder/time-recorder.component'
import ToDoList from '../../components/todo-list/todo-list.component'
import './focus-mode.style.scss'
import {useParams} from 'react-router-dom'
import { Card } from 'antd'
import { createStructuredSelector } from 'reselect'
import { selectCurrentUser } from '../../redux/user/user.selector'
import { selectCurrentRoutines } from '../../redux/routines/routines.selector'
import { connect , ConnectedProps} from 'react-redux'
import Routine from '../../components/Routine/Routine'
import RoutineType from '../../types/routine.type'

const mapStateToProps = createStructuredSelector({
  user: selectCurrentUser,
  routines: selectCurrentRoutines,
})

const connector = connect(mapStateToProps)

export type PropsFromRedux = ConnectedProps<typeof connector>

const FocusModePage : React.FC<PropsFromRedux> = ({user, routines}) => {
  const {routineId} = useParams()
  const selectedRoutine = routines?.find((routine : RoutineType) => routine.routineId === routineId)
  if(!selectedRoutine){
    return (
      <main>
        routine not found
      </main>
    )
  }

  return (
    <div className='focus-mode-page'>
      <TimeRecorderPage user={user}/>
      <ToDoList user={user}/>
      <Routine routine={selectedRoutine}/>
    </div>
  )
}

export default connector(FocusModePage)
