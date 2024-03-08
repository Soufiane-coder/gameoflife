// import { useState } from 'react'
import { useState } from 'react';
import './add-routine-popup.style.scss';

import dayjs from 'dayjs';

import Picker from "@emoji-mart/react";
import { randomColor } from "randomcolor";
import { Modal , Form, Input, InputNumber, TimePicker, Select, Slider , Button} from 'antd'

const { TextArea } = Input
const AddRoutinePopup = ({open, onCancel}) => {
	const [form] = Form.useForm();
	const [showEmojis, setShowEmojis] = useState(false)
	const [emoji, setEmoji] = useState('📖')
	const [bgEmojiColorBtn, setBgEmojiColorBtn] = useState('#fff')

	const daysSchedule = [
		// {value:'day', label: 'Day'},
		{value: 'monday', label: 'Monday'},
		{value: 'tuesday', label: 'Tuesday'},
		{value: 'wednesday', label: 'Wednesday'},
		{value: 'thursday', label: 'Thursday'},
		{value: 'friday', label: 'Friday'},
		{value: 'saturday', label: 'Saturday'},
		{value: 'sunday', label: 'Sunday'}
	]

	const initialValues = {
		title: "",
		description: "",
		message: "",
		priority: "low",
		level: 1,
		range: [dayjs('00:00:00', 'HH:mm:ss'),dayjs('00:00:00', 'HH:mm:ss')],
		days: daysSchedule.map(day => day.value),
		emoji: "",
		isArchived: false,
		skip: 0,
		combo: 0,
		isSubmitted: false,
	}

	const onFinish = (values) => {
		console.log(values)
	}

	const onOk = () => {
		form.submit();
	  };

	const EmojiPickerModel = ({open}) => {
		return (
			<Modal open={open} onCancel={() => setShowEmojis(false)} footer={false} closable={false} width={'fit-content'}>
				<Picker onEmojiSelect={(emoji) => {setEmoji(emoji.native);setShowEmojis(false)}}/>
			</Modal>
		)
	}
	
	const footer = (_, { OkBtn, CancelBtn }) => (
		<>
		  	<Button type='primary' color='cyan' onClick={() => {setShowEmojis(true)}}>Change Emoji</Button>
			<CancelBtn />
		 	<OkBtn />
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
				setEmoji('📖')
				setBgEmojiColorBtn('#fff')
				onCancel()}}
			okText='Add Routine'
			okType='primary'
			okButtonProps={{color: 'green'}}
			footer={footer}
			>
			<Button 
				style={{backgroundColor: bgEmojiColorBtn}}
				onClick={() => {setBgEmojiColorBtn(randomColor());}}
				className="routine-emoji">{emoji}</Button>
			<Form form={form} initialValues={initialValues} layout="vertical" onFinish={onFinish} name="userForm">
			<Form.Item name="title" label="Title"
				rules={[{ required: true, message: 'Please input the title!' }]}>
				<Input />
			</Form.Item>
			<Form.Item name="description" label="Description"
				rules={[{ required: true, message: 'Please input the description!' }]}>
				<TextArea />
			</Form.Item>
			<Form.Item name="message" label="Message">
				<TextArea />
			</Form.Item>
			<Form.Item name="range" label="Range picker"
				>
				<TimePicker.RangePicker style={{width: '100%'}}/>
			</Form.Item>
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
					// className="add-routine-window__priority-input"
					// value={addRoutineForm.priority}
					// onChange={handleChange}
					// fieldNames='blahlbah'
				>
					<Select.Option
						// className="add-routine-window__priority-option"
						value="low"
					>
						Low
					</Select.Option>
					<Select.Option
						// className="add-routine-window__priority-option"
						value="medium"
					>
						Medium
					</Select.Option>
					<Select.Option
						// className="add-routine-window__priority-option"
						value="important"
					>
						Important
					</Select.Option>
				</Select>
				</Form.Item>
			</Form>
			<EmojiPickerModel open={showEmojis}/>
		</Modal>
	)
}

export default AddRoutinePopup
