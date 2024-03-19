import React, { useContext, useEffect } from "react";
import { ReactComponent as Done } from '../../assets/icons/done.svg';
import { ReactComponent as Remove } from '../../assets/icons/remove.svg';
import { ReactComponent as Skip } from '../../assets/icons/skip.svg';
import { ReactComponent as Undone } from '../../assets/icons/undone.svg';
import { ReactComponent as MessageIcon } from '../../assets/icons/message.svg';
import { ReactComponent as MoreOptionsIcon } from '../../assets/icons/more.svg';
import './Routine.scss';

import { connect } from "react-redux";
import { selectCurrentRoutines } from "../../redux/routines/routines.selector";
import { createStructuredSelector } from "reselect";
import { selectCurrentUser } from "../../redux/user/user.selector";
import { removeRoutine, skipRoutine, setArchivedOption } from "../../redux/routines/routines.actions";
import { buySkip } from '../../redux/user/user.actions';
import { useState } from "react";

import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import AddRoutinePopup from '../add-routine-popup/add-routine-popup.component';
import { ReactComponent as GoalIcon } from '../../assets/icons/goal.svg';
import { useHistory } from "react-router-dom";
import { displayCheckPopupState, displayMessagePopupState, displayAddRoutinePopupState } from "../../redux/popup/popup.actions";
import { ReactComponent as Cracks } from '../../assets/cracks.svg';
import { 
	setArchivedOptionInFirebase,
	deleteRoutineFromFirebase ,
	addSkipDayToFirebase ,
	buySkipFromFirebase} from "../../../lib/firebase";
import {Badge, Button, Space, Dropdown} from 'antd';
// import type { MenuProps } from 'antd';
import { ContextHolderNotification, ContextHolderMessage } from "../../App";
import { selectCurrentCategories } from "../../redux/categories/categories.selector";
import CheckRoutinePopup from '../../components/check-routine-popup/check-routine-popup.component'

{/* <ul className="routine__other-options-list" style={!showOtherOptions ? { display: 'none' } : {}}>
								<li className="routine__other-options-item"
									onClick={async () => {
										await setArchivedOptionInFirebase(user.uid, routine.routineId, !routine.isArchived)
										setArchivedOption(routine.routineId, !routine.isArchived)
									}}>{routine.isArchived ? "Desarchive" : "Archive"}</li>
								<li className="routine__other-options-item"
									onClick={handleEditRoutine}
									>Edit</li>
								<li className="routine__other-options-item"
								onClick={handleRemove}>Delete</li>
							</ul> */}

// const items: MenuProps['items'] = [

const Routine = (
	{ 
		user, routine, removeRoutine, setArchivedOption,
		skipRoutine, buySkip,
		displayCheckPopupState, displayMessagePopupState,
		displayAddRoutinePopupState,
		categories
	}) => {
	const history = useHistory();
	const [deleteLoading, setDeleteLoading] = useState(false);
	const [skipLoading, setSkipLoading] = useState(false);
	const notificationApi = useContext(ContextHolderNotification);
	const messageApi = useContext(ContextHolderMessage);
	const [open, setOpen] = useState({
		addRoutine : false,
		checkRoutine: false,
	});

	const handleDone = async (event) => {
		event.preventDefault();
		setOpen(old =>
			{
				old.checkRoutine = true;
				return {...old};
			})
	}

	const handleSkip = async (event) => {
		setSkipLoading(true);
		const { routineId} = routine
		try{
			if(user.coins >= 10) {
				await buySkipFromFirebase(user.uid);
				buySkip();
	
				await addSkipDayToFirebase (user.uid, routineId);
				skipRoutine(routineId);	
			}
			messageApi.open({
				type: 'success',
				content: 'Skip added',
			})
		}
		catch(error){
			setSkipLoading(false);
			console.error(error);
            messageApi.open({
				type: 'error',
				content: 'Failed skip routine',
			})
        }finally{
			setSkipLoading(false);
		}
	}

	const handleRemoveRoutine = async (routineId) => {
		setDeleteLoading(true);
		try{
			await deleteRoutineFromFirebase(user.uid, routineId);
			removeRoutine(routineId);
			messageApi.open({
				type: 'success',
				content: 'Item deleted',
			})
		}
		catch(err){
			console.error(err)
			messageApi.open({
				type: 'error',
				content: 'Failed delete routine',
			})
		}
		finally{
			setDeleteLoading(false)
			notificationApi.destroy()
		}
	}

	const handleRemove = async (event) => {
		event.preventDefault();
		const { routineId } = routine
		const btn = (
			<Space>
				<Button 
					type='default'
					// type='button'
					onClick={() => {notificationApi.destroy();}}
					>Cancel</Button>
				<Button
					type='primary'
					// thmlType='submit'
					color='red'
					loading={deleteLoading} // not working cause not re-rendering
					onClick={() => handleRemoveRoutine(routineId)} >Delete this rouitne</Button>
			</Space>)

		notificationApi.warning({
			placement: 'top',
			message: 'Do you want to delete this routine',
			description: `${routine.title}: ${routine.description}`,
			duration: null,
			btn : btn,
		})
	}

	const handleMessage = (event) => {
		const {routineId} = routine
		displayMessagePopupState(routineId);
	}

	const handleRoadMapClick = (event) => {
		const { routineId } = routine
		history.push(`/road-map/${routineId}`)
	}
	
	const handleEditRoutine = (event) => {
		event.preventDefault();
		setOpen(old => {
			old.addRoutine = true;
			return {...old};
		})
	}

	const menuItems = [
		{
			key: '1',
			label: (
			<a onClick={async (event) => {
				event.preventDefault();
				await setArchivedOptionInFirebase(user.uid, routine.routineId, !routine.isArchived)
				setArchivedOption(routine.routineId, !routine.isArchived)
			}}>
				{routine.isArchived ? "Desarchive" : "Archive"}
			</a>
			),
		},
		{
			key: '2',
			label: (
			<a onClick={handleEditRoutine}>
				Edit
			</a>
			),
		},
		{
			key: '3',
			label: (
			<a  onClick={() => history.push('/focus-mode/' + routine.routineId)}>
				Focus mode
			</a>
			),
		},
		{
			key: '4',
			label: (
			<a  onClick={handleRemove}>
				Delete
			</a>
			),
		},
	];

	return (
		// this div for badge to be fixes in its place
		<div> 
			<Badge.Ribbon 
				text={routine.priority.charAt(0).toUpperCase() + routine.priority.slice(1)}
				color={routine.priority === 'important' ? 'red' : (routine.priority === 'medium' ? 'volcano': 'cyan')}>
				<div className='routine' id={routine.routineId}>
					<div className="emoji" style={{ backgroundColor: routine.bgEmojiColor }}>{deleteLoading ? <LoadingSpinner /> : routine.emoji}</div>
					<div className="title">{routine.title}</div>
					<div className="description">{routine.description}</div>
					<div className="extra">
						<div className="combo">{routine.combo === 0 ? "" : `🔥${routine.combo}`}</div>
						<div className="skip-num">{routine.skip === 0 ? "" : `↪️${routine.skip}`}</div>
						<div className="level">🎚️{routine.level}</div>
					</div>
					<div className="buttons">
						{
							routine.isSubmitted === false ?
								<Button 
									className="routine__btn"
									type='primary'
									color='green'
									onClick={handleDone}><Done /></Button>
								:
								<Button className="routine__btn" disabled><Undone /></Button>
						}
						<Button 
							className="routine__btn"
							type="primary"
							color="cyan"
							disabled={user.coins < 10}
							onClick={handleSkip}>
							{
								skipLoading ? <LoadingSpinner /> : <Skip />
							}
						</Button>
						<Button
							className="routine__btn"
							type="primary"
							color="volcano"
							onClick={handleMessage} >
							<MessageIcon />
						</Button>
						<Button 
							className="routine__btn"
							type="primary"
							color="red"
							onClick={handleRoadMapClick} >
							<GoalIcon />
						</Button>
						<Dropdown menu={{items: menuItems}} placement="topRight">
							<Button 
								type="text"
								className="routine__other-options "
								>
								< MoreOptionsIcon />
							</Button>
						</Dropdown>
					</div>
				</div>
				<AddRoutinePopup 
					user={user}
					open={open.addRoutine}
					onCancel={
						() => setOpen(old => {old.addRoutine = false; return {...old};})}
					categories={categories}
					routineToEdit={routine}/>
				<CheckRoutinePopup 
					open={open.checkRoutine}
					routine={routine}
					onCancel={
						() => setOpen(old => {old.checkRoutine = false; return {...old};})}/>
			</Badge.Ribbon>
		</div>
	)
}

const mapStateToProps = createStructuredSelector({
	routinesCollection: selectCurrentRoutines,
	user: selectCurrentUser,
	categories: selectCurrentCategories
})

const mapDispatchToProps = (dispatch) => ({
	removeRoutine: (routineId) => dispatch(removeRoutine(routineId)),
	skipRoutine: (routineId) => dispatch(skipRoutine(routineId)),
	buySkip: () => dispatch(buySkip()),
	displayCheckPopupState: (state) => dispatch(displayCheckPopupState(state)),
	displayMessagePopupState: (state) => dispatch(displayMessagePopupState(state)),
	setArchivedOption: (routineId, archivedId) => dispatch(setArchivedOption(routineId, archivedId)),
	displayAddRoutinePopupState: (state) => dispatch(displayAddRoutinePopupState(state)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Routine);