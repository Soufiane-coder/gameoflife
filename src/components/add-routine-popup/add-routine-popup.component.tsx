import React , { useState } from 'react';
import './add-routine-popup.style.scss';

import RoutineType from '../../types/routine.type';
import { PriorityType } from '../../types/general.type'

import { Timestamp } from 'firebase/firestore';
import { addRoutineToFirebase, editRoutineInFirebase } from '../../../lib/firebase/routine.apis';

import { daysSchedule} from '../../utils';

import dayjs from 'dayjs';

import Picker from "@emoji-mart/react";
import { randomColor } from "randomcolor";
import { Modal , Form, Input, TimePicker, Select, Slider , Button} from 'antd'
import { addRoutine, editRoutine } from '../../redux/routines/routines.actions';
import { connect, ConnectedProps} from 'react-redux';

const mapDispatchToProps = (dispatch: any) => ({
	editRoutine: (routine: RoutineType) => dispatch(editRoutine(routine)),
	addRoutine: (routine : RoutineType) => dispatch(addRoutine(routine)),
})
const connector = connect(null, mapDispatchToProps)
export type PropsFromRedux = ConnectedProps<typeof connector>
import Params from './types';

const { TextArea } = Input

const AddRoutinePopup : React.FC<Params> = ({user, open, onCancel, categories, routineToEdit, editRoutine, addRoutine}) => {
	const [form] = Form.useForm();
	const [showEmojis, setShowEmojis] = useState<boolean>(false)
	const [emoji, setEmoji] = useState<string>(routineToEdit?.emoji || '')
	const [bgEmojiColor, setBgEmojiColor] = useState<string>(routineToEdit?.bgEmojiColor || '#fff')
	const [isLoading, setIsLoading] = useState<boolean>(false)

	const prioritiesOptions : {value: PriorityType, label: string}[] = [
		{value: PriorityType.LOW, label: 'Low'}, 
		{value: PriorityType.MEDIUM , label: 'Medium'},
		{value: PriorityType.IMPORTANT , label: 'Important'},
	]

	const initialValues : RoutineType = routineToEdit? {...routineToEdit} : {
		title: "",
		description: "",
		message: "",
		priority: PriorityType.LOW,
		level: 1,
		rangeTime: [
			dayjs('00:00:00', 'HH:mm:ss'),
			dayjs('00:00:00', 'HH:mm:ss'),
		],
		days: daysSchedule.map(day => day.value),
		emoji: "",
		isArchived: false,
		skip: 0,
		combo: 0,
		isSubmitted: false,
		categoryId : '',
		lastSubmit : dayjs(0),
		bgEmojiColor : '#fff',
		character : '',
	}

	let categoriesOption = categories.map(category => ({label: `${category.emoji} ${category.label}`, value: category.categoryId}))
	categoriesOption = [{value: '', label: 'Default'}, ...categoriesOption]

	const onFinish = async (values : RoutineType) => {
		setIsLoading(true)
		try {
			if(routineToEdit){
				await editRoutineInFirebase(user.uid,  {...initialValues, ...values, emoji, bgEmojiColor})
				editRoutine({...initialValues, ...values, emoji, bgEmojiColor})
			}
			else{
				const routineId = await addRoutineToFirebase(user.uid, {...initialValues, ...values, emoji, bgEmojiColor})
				addRoutine({...initialValues, ...values, emoji, bgEmojiColor, routineId})
			}
		}
		catch(err) {
			console.error(err);
		}finally{
			setIsLoading(false)
			onCancel()
		}
	}

	const onOk = () => {
		form.submit();
	};

	const EmojiPickerModel = ({open}: {open: boolean}) => {
		return (
			<Modal open={open} onCancel={() => setShowEmojis(false)} footer={false} closable={false} width={'fit-content'}>
				<Picker onEmojiSelect={(emoji) => {setEmoji(emoji.native);setShowEmojis(false)}}/>
			</Modal>
		)
	}
	
	const footer = (_ : any, { OkBtn, CancelBtn } : {OkBtn: React.FC, CancelBtn: React.FC}) => (
		<>
		  	<Button type='primary' color='cyan' onClick={() => {setShowEmojis(true)}}>Change Emoji</Button>
			<CancelBtn />
		 	<Button type='primary' color='green' loading={isLoading} onClick={onOk}> {routineToEdit ? 'Edit Routine' : 'Add routine'}</Button>
		</>
	  )

	return (

		<Modal 
			title="Add routine"
			open={open} 
			onOk={onOk}
			style={{top: 60}}
			onCancel={() => {
				form.resetFields();
				setEmoji('')
				setBgEmojiColor('#fff')
				onCancel()}}
			okText='Add Routine'
			okType='primary'
			okButtonProps={{color: 'green'}}
			footer={footer}
			>
				
			<Button 
				style={{backgroundColor: bgEmojiColor}}
				onClick={() => {setBgEmojiColor(randomColor());}}
				className="routine-emoji">{emoji}</Button>
		 	<Form
				labelCol={{ span: 5 }} 
				wrapperCol={{ span: 18 }}
				form={form}
				initialValues={initialValues} layout="horizontal" onFinish={onFinish} name="userForm">
			<Form.Item name="title" label="Title"
				rules={[{ required: true, message: 'Please input the title!' }]}>
				<Input />
			</Form.Item>
			<Form.Item name="description" label="Description"
				rules={[{ required: true, message: 'Please input the description!' }]}>
				<TextArea autoSize={{ minRows: 2, maxRows: 3 }}/>
			</Form.Item>
			<Form.Item name="message" label="Message">
				<TextArea autoSize={{ minRows: 2, maxRows: 3 }}/>
			</Form.Item>
			{/* <Form.Item name="rangeTime" label="Range picker"
				>
				<TimePicker.RangePicker style={{width: '100%'}}/>
			</Form.Item> */}
			<Form.Item name="days" label='Days'
				rules={[{ required: true, message: 'Please input the days!' }]}>
				<Select
					options={daysSchedule}
					mode='tags'
					maxTagCount='responsive'
					// className="add-routine-window__category-input"
					// name='day-schedule'
					// defaultValue={daysSchedule[0]}
					// onChange={handleSelectDays}
					// value={addRoutineForm.days}
					/>
			</Form.Item>
			<Form.Item name="level" label='Difficulty'>
				<Slider
					min={1}
					max={5}
					// className="add-routine-window__difficulty-input"
					// value={addRoutineForm.level}
					// onChange={handleChangeDiff}
				/>
			</Form.Item >
				<Form.Item name="priority" label='Priority'>
					<Select
						options={prioritiesOptions}
					/>
				</Form.Item>
				<Form.Item name="categoryId" label='Category'>
					<Select
							options={categoriesOption }
						/>
				</Form.Item>
			</Form>
			<EmojiPickerModel open={showEmojis}/>
		</Modal>
	)
}





export default connector(AddRoutinePopup)
