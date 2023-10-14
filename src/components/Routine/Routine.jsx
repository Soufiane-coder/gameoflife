import React, { useContext } from "react";
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
import { ReactComponent as GoalIcon } from '../../assets/icons/goal.svg';
import { useHistory } from "react-router-dom";
import { displayCheckPopupState, displayMessagePopupState, displayAddRoutinePopupState } from "../../redux/popup/popup.actions";
import { ReactComponent as Cracks } from '../../assets/cracks.svg';
import { 
	setArchivedOptionInFirebase,
	deleteRoutineFromFirebase ,
	addSkipDayToFirebase ,
	buySkipFromFirebase} from "../../../lib/firebase";
import { MyContext } from "../../App";

const Routine = (
	{ 
		user, routine, removeRoutine, setArchivedOption,
		skipRoutine, buySkip,
		displayCheckPopupState, displayMessagePopupState,
		displayAddRoutinePopupState
	}) => {
	const history = useHistory();

	const [showOtherOptions, setShowOtherOptions] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(false);
	const [skipLoading, setSkipLoading] = useState(false);
	const {notificationSystem} = useContext(MyContext);

	const handleDone = async (event) => {
		const id = event.target.closest('.routine').id;
		displayCheckPopupState(id);
	}

	const handleSkip = async (event) => {
		setSkipLoading(true);
		const {id: routineId} = event.target.closest('.routine');
		try{
			if(user.coins >= 10) {
				await buySkipFromFirebase(user.uid);
				buySkip();
	
				await addSkipDayToFirebase (user.uid, routineId);
				skipRoutine(routineId);	
			}
		}
		catch(error){
			setSkipLoading(false);
			console.error(error);
            notificationSystem.current.addNotification({
                title: 'Error',
                message: 'Error while skipping routine',
                level: 'error',
                position: 'tl',
                autoDismiss: 5
            });
        }finally{
			setSkipLoading(false);
		}
	}

	const handleRemoveRoutine = async (routineId) => {
		setDeleteLoading(true);
		try{
			await deleteRoutineFromFirebase(user.uid, routineId);
			removeRoutine(routineId);
		}
		catch(err){
			console.error(err)
			notificationSystem.current.addNotification({
                title: 'Error',
                message: 'Error while removing routine',
                level: 'error',
                position: 'tl',
                autoDismiss: 5
            });
		}
		finally{
			setDeleteLoading(false)
		}
	}

	const handleRemove = async (event) => {
		event.preventDefault();
		const { id } = event.target.closest('.routine');
		const notification = notificationSystem.current;
		notification.addNotification({
			title: 'Do you really want to delete this item',
			message: routine.title,
			level: 'warning',
			autoDismiss: 0,
			children : (
				<div style={{display: 'flex', justifyContent: 'space-between'}}>
					<button style={{border: 'none'}}>cancel</button>
					<button onClick={() => handleRemoveRoutine(id)} style={{backgroundColor: '#ebad1a',color: '#fff', border: 'none'}}>Delete this rouitne</button>
				</div>
			),
			position: 'tc',
		});
	}

	const handleMessage = (event) => {
		const id = event.target.closest('.routine').id;
		displayMessagePopupState(id);
	}

	const handleRoadMapClick = (event) => {
		const { id } = event.target.closest('.routine');
		history.push(`/road-map/${id}`)
	}
	const handleEditRoutine = (event) => {
		event.preventDefault();
		displayAddRoutinePopupState(routine.routineId)
	}
	return (
		
			<div className='routine' id={routine.routineId}>
				
				{
					routine.priority === 'important' && <div className="important"></div>
				}
				{
					routine.priority === 'medium' && <div className="medium"></div>
				}
				{/* {
					<Cracks style={{ width: '100%', position: 'absolute', zIndex: '-1', height: '100%', top: '0', left: '0' }} />
				} */}

				<div className="emoji" style={{ backgroundColor: routine.bgEmojiColor }}>{deleteLoading ? <LoadingSpinner /> : routine.emoji}</div>
				<div className="title">{routine.title}</div>
				<div className="description">{routine.description}</div>
				<div className="extra">
					<div className="combo">{routine.combo === 0 ? "" : `⚡${routine.combo}`}</div>
					<div className="skip-num">{routine.skip === 0 ? "" : `↪️${routine.skip}`}</div>
					<div className="level">🎚️{routine.level}</div>
				</div>
				<div className="buttons">
					{
						routine.isSubmitted === false ?
							<button className="btn btn-success done" onClick={handleDone}><Done /></button>
							:
							<button className="btn btn-secondary done" disabled><Undone /></button>
					}
					<button className="btn btn-info skip" disabled={user.coins < 10} onClick={handleSkip}>
						{
							skipLoading ? <LoadingSpinner /> : <Skip />
						}
					</button>
					<button className="btn btn-message message" onClick={handleMessage} >
						<MessageIcon />
					</button>
					<button className="btn btn-danger remove  " onClick={handleRoadMapClick} >
						<GoalIcon />
					</button>
					<button className="routine__other-options " onClick={() => setShowOtherOptions(!showOtherOptions)}>

						<ul className="routine__other-options-list" style={!showOtherOptions ? { display: 'none' } : {}}>
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
						</ul>
						< MoreOptionsIcon />
					</button>
				</div>
			</div>
	)
}

const mapStateToProps = createStructuredSelector({
	routinesCollection: selectCurrentRoutines,
	user: selectCurrentUser,
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