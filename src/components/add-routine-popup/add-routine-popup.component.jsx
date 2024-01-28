import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { ReactComponent as Close } from "../../assets/icons/close.svg";
import { ReactComponent as AddBoxIcon } from "../../assets/icons/add_box.svg";

import { addRoutine, editRoutine } from "../../redux/routines/routines.actions";
import { selectCurrentUser } from "../../redux/user/user.selector";
import "./add-routine-popup.style.scss";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import Zoom from "react-reveal/Zoom";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { randomColor } from "randomcolor";

import TimeKeeper from "react-timekeeper";
import { isTimeInArray, customStyles } from "./utils";
import { timeStringToFloat } from "../../utils/clock";
import { selectCurrentRoutines } from "../../redux/routines/routines.selector";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { hidePopup } from "../../redux/popup/popup.actions";
import {
	addRoutineToFirebase,
	editRoutineInFirebase,
} from "../../../lib/firebase";
import { Timestamp } from "firebase/firestore";
import { selectCurrentCategories } from "../../redux/categories/categories.selector";
import { NotficationContext } from "../../App";
import { Button } from '@mui/material';


const AddRoutinePopup = ({
	user,
	addRoutine,
	routines,
	hidePopup,
	editRoutine,
	editThisRoutine,
	categories,
}) => {
	const {notificationSystem} = useContext(NotficationContext);
	if (editThisRoutine) {
		editThisRoutine = routines.find(({ routineId }) => routineId === editThisRoutine)
	}

	const selectCategoriesOptions = [];

	categories.forEach(category => {
		selectCategoriesOptions.push({
			categoryId: category.categoryId,
			label: category.label
		})
	})

	const [emoji, setEmoji] = useState(editThisRoutine ? editThisRoutine.emoji : '');
	const [showEmojiList, setShowEmojiList] = useState(false);
	const [showTimePiker, setShowTimePicker] = useState(false);

	const [addRoutineForm, setAddRoutineForm] = useState(
		editThisRoutine
			? {
				...editThisRoutine
			}
			: {
				title: "",
				description: "",
				message: "",
				priority: "low",
				level: 1,
				emoji: "",
				startRoutine: "12:00",
				endRoutine: "12:00",
				isArchived: false,
				skip: 0,
				combo: 0,
				isSubmitted: false,
			}
	);

	const [bgEmojiColorBtn, setbgEmojiColorBtn] = useState(editThisRoutine ? editThisRoutine.bgEmojiColor : '');
	const [categoryId, setCategoryId] = useState(
		editThisRoutine ? (editThisRoutine.categoryId || (selectCategoriesOptions[0]?.categoryId || 'default')) : (selectCategoriesOptions[0]?.categoryId || 'default'))

	const [loadingAdding, setLoadingAdding] = useState(false);

	const handleChange = (event) => {
		const { name, value, type } = event.target;
		if (type === "checkbox") {
			setAddRoutineForm({ ...addRoutineForm, important: event.target.checked });
			return;
		}
		else if (name === 'categories') {
			setCategoryId(value)
		}
		setAddRoutineForm({ ...addRoutineForm, [name]: value });
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		// if (!addRoutineForm.title && !addRoutineForm.description) {
		// 	notificationSystem.current.addNotification({
        //         title: 'Error',
        //         message: 'Title and description fields are required',
        //         level: 'warning',
        //         position: 'tc',
        //         autoDismiss: 5
        //     });
		// 	return;
		// }

		if (
			timeStringToFloat(addRoutineForm.startRoutine) >
			timeStringToFloat(addRoutineForm.endRoutine)
		) {
			notificationSystem.current.addNotification({
                title: 'Error',
                message: 'The hour of start is bigger than the hour of end',
                level: 'warning',
                position: 'tc',
                autoDismiss: 5
            });
			return;
		}

		if (
			isTimeInArray(routines, addRoutineForm.startRoutine) ||
			isTimeInArray(routines, addRoutineForm.endRoutine)
		) {
			alert("There is over writing an existing routine");
			return;
		}
		setLoadingAdding(true);

		if (categoryId === 'default') { alert('category label not defiend'); return; }

		try {
			if (editThisRoutine) {
				await editRoutineInFirebase(user.uid,
					{
						...addRoutineForm,
						categoryId,
						emoji,
						bgEmojiColor: bgEmojiColorBtn,
					});

				editRoutine({ ...addRoutineForm, emoji, bgEmojiColor: bgEmojiColorBtn })
			} else {
				const newRoutineObject = {
					...addRoutineForm,
					level: Number(addRoutineForm.level),
					emoji,
					bgEmojiColor: bgEmojiColorBtn,
					lastSubmit: new Timestamp(0, 0),
					categoryId,
				};
				const routineId = await addRoutineToFirebase(
					user.uid,
					newRoutineObject,
				);
				addRoutine({ ...newRoutineObject, routineId });
			}
		} catch (err) {
			console.error(`Error detected login : ${err.message}`);
		} finally {
			setLoadingAdding(false);
		}
	};
	const handleEmoji = (emoji) => {
		setEmoji(emoji.native);
		setShowEmojiList(false);
	};

	const handleTimeRoutine = (event) => {
		event.preventDefault();
		const { name } = event.target;
		setShowTimePicker(name);
	};

	const handleChangeTime = (newTime) => {
		const formatTime = (time) => {
			const [hours, minutes] = time.split(":");
			const formattedTime = `${hours.padStart(2, "0")}:${minutes}`;
			return formattedTime;
		};

		const timeRoutine = formatTime(newTime.formatted24);

		if (isTimeInArray(routines, timeRoutine)) {
			alert("It is already selected by other routine, choose another one");
			return;
		}
		if (showTimePiker === "start-routine") {
			setAddRoutineForm((old) => ({ ...old, startRoutine: timeRoutine }));
		} else if (showTimePiker === "end-routine") {
			setAddRoutineForm((old) => ({ ...old, endRoutine: timeRoutine }));
		}
	};
	const handleClickBgColor = (event) => {
		event.preventDefault();
		setbgEmojiColorBtn(randomColor());
	};





	return (
		<div className="add-routine-window">
			{showEmojiList && (
				<Picker
					className="add-routine-window__emoji-list"
					data={data}
					onEmojiSelect={handleEmoji}
				/>
			)}

			{showTimePiker && (
				<div className="add-routine-window__clock">
					<TimeKeeper
						time={
							showTimePiker === "start-routine"
								? addRoutineForm.startRoutine
								: addRoutineForm.endRoutine
						}
						onChange={handleChangeTime}
						disabledTimeRange={
							showTimePiker === "start-routine"
								? {}
								: { from: "23:59", to: addRoutineForm.startRoutine }
						}
						hour24Mode
						doneButton={() => (
							<div
								className="add-routine-window__close-clock"
								onClick={() => setShowTimePicker(false)}
							>
								Close
							</div>
						)}
					/>
				</div>
			)}
			<Zoom duration={500}>
				<form className="popup-window add-routine-window__popup" onSubmit={handleSubmit}>
					<div className="popup-window__head add-routine-window__head">
						<AddBoxIcon className="add-routine-window__add-box-icon" />
						<h3 className="add-routine-window__title">
							{editThisRoutine ? "Modifie your routine" : "Add routine"}
						</h3>
						<Close
							className="add-routine-window__close-icon"
							onClick={() => {
								hidePopup(false);
							}}
						/>
					</div>
					<h5 className="add-routine-window__title-input-label">Title</h5>
					<input
						type="text"
						className="add-routine-window__title-input"
						name="title"
						id="routine-title"
						value={addRoutineForm.title}
						onChange={handleChange}
						required
					/>

					<h5 className="add-routine-window__description-input-label">
						Description
					</h5>
					<textarea
						className="add-routine-window__description-input"
						name="description"
						id="routine-description"
						cols="30"
						rows="10"
						value={addRoutineForm.description}
						onChange={handleChange}
						required
					></textarea>

					<h5 className="add-routine-window__message-input-label">Message</h5>
					<textarea
						className="add-routine-window__message-input"
						name="message"
						id="routine-message"
						cols="30"
						rows="10"
						value={addRoutineForm.message}
						onChange={handleChange}
					></textarea>


					{/* <div className="add-routine-window__start"> */}
						<h5 className="add-routine-window__start-label">Start</h5>
						<input
							className="add-routine-window__start-time-input"
							type="time"
							name="start-routine"
							value={addRoutineForm.startRoutine}
							onChange={() => { }}
							onClick={handleTimeRoutine}
						></input>
					{/* </div> */}
					{/* <div className="add-routine-window__end"> */}
						<h5 className="add-routine-window__end-label">End</h5>
						<input
							className="add-routine-window__end-time-input"
							type="time"
							name="end-routine"
							value={addRoutineForm.endRoutine}
							onChange={() => { }}
							onClick={handleTimeRoutine}
						></input>
					{/* </div> */}
					{/* <div> */}
						<h5 className="add-routine-window__difficulty-input-label">
							Difficulty
						</h5>
						<div className="add-routine-window__difficulty-input-div">
							<input
								className="add-routine-window__difficulty-input"
								type="range"
								name="level"
								id="range-difficulty"
								min="1"
								max="5"
								value={addRoutineForm.level}
								onChange={handleChange}
							/>
							<p className="add-routine-window__difficulty-input-value">
								{addRoutineForm.level}🎚️
							</p>
						</div>


						<h5 className="add-routine-window__priority-input-label">
							Priority
						</h5>
						<select
							className="add-routine-window__priority-input"
							name="priority"
							value={addRoutineForm.priority}
							onChange={handleChange}
						>
							<option
								className="add-routine-window__priority-option"
								value="low"
							>
								Low
							</option>
							<option
								className="add-routine-window__priority-option"
								value="medium"
							>
								Medium
							</option>
							<option
								className="add-routine-window__priority-option"
								value="important"
							>
								Important
							</option>
						</select>

					<h5 className="add-routine-window__category-input-label">
							Category
					</h5>
					 <select
						className="add-routine-window__category-input"
						name="categories"
						onChange={handleChange}
						value={categoryId}
					>
						{
							selectCategoriesOptions.map(category => (
								<option
									key={`cat-opt__${category.categoryId}`}
									className="add-routine-window__priority-option"
									value={category.categoryId}
								>
									{category.label}
								</option>
							))
						}
					</select>
					
					<div className="add-routine-window__emoji-section">
						<Button
							variant="contained"
							color='warning'
							type='button'
							className="popup-window__button add-routine-window__emoji-btn"
							onClick={(event) => {
								event.preventDefault();
								setShowEmojiList(true);
							}}
						>
							Choose Emoji
						</Button>
						<span
							style={{ backgroundColor: bgEmojiColorBtn }}
							className="add-routine-window__emoji-over-view"
						>
							{emoji}
						</span>
					</div>

					<Button
						className="popup-window__button add-routine-window__color-btn"
						variant="contained"
						color='info'
						type='button'
						onClick={handleClickBgColor}
					>
								Change color
					</Button>

					<Button 
						className="popup-window__button add-routine-window__add-btn"
						variant="contained"
						color='success'
						type='submit'
					>
						{loadingAdding ? (
							<LoadingSpinner />
						) : editThisRoutine ? (
							"Modify Routine"
						) : (
							"Add Routine"
						)}
					</Button>
				</form>
			</Zoom>
		</div>
	);
};
const mapStateToProps = createStructuredSelector({
	user: selectCurrentUser,
	routines: selectCurrentRoutines,
	categories: selectCurrentCategories
});

const mapDispatchToProps = (dispatch) => ({
	addRoutine: (routine) => dispatch(addRoutine(routine)),
	hidePopup: () => dispatch(hidePopup()),
	editRoutine: (routine) => dispatch(editRoutine(routine))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddRoutinePopup);
