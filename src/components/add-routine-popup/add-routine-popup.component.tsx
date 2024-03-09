import React , { useState } from 'react';
import './add-routine-popup.style.scss';

import Params from './types';
import RoutineType from '../../types/routine.type';
import { PriorityType } from '../../types/general.type'

import { Timestamp } from 'firebase/firestore';
import { addRoutineToFirebase } from '../../../lib/firebase/routine';

import { daysSchedule} from '../../utils';

import dayjs from 'dayjs';

import Picker from "@emoji-mart/react";
import { randomColor } from "randomcolor";
import { Modal , Form, Input, TimePicker, Select, Slider , Button} from 'antd'

const { TextArea } = Input
const { confirm } = Modal


const AddRoutinePopup :React.FC<Params> = ({user, open, onCancel, categories}) => {
	const [form] = Form.useForm();
	const [showEmojis, setShowEmojis] = useState<boolean>(false)
	const [emoji, setEmoji] = useState<string>('')
	const [bgEmojiColor, setBgEmojiColor] = useState<string>('#fff')
	const [isLoading, setIsLoading] = useState<boolean>(false)

	const prioritiesOptions : {value: PriorityType, label: string}[] = [
		{value: PriorityType.LOW, label: 'Low'}, 
		{value: PriorityType.MEDIUM , label: 'Medium'},
		{value: PriorityType.IMPORTANT , label: 'Important'},
	]

	const initialValues : RoutineType = {
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
			await addRoutineToFirebase(user.uid, {...initialValues, ...values, emoji, bgEmojiColor})
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
		 	<Button type='primary' color='green' loading={isLoading} onClick={onOk}> Add Routine</Button>
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

export default AddRoutinePopup
