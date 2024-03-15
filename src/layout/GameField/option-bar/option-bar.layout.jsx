import { ReactComponent as CoinIcon } from "../../../assets/icons/coin-icon.svg";
import "./option-bar.style.scss";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectCurrentUser } from "../../../redux/user/user.selector";
import { selectCurrentRoutines } from "../../../redux/routines/routines.selector";

import Filter from "../../../components/Filter/Filter";

// import Select from "react-select";
import { Select } from 'antd';
import { daysSchedule as daysWeekOptions, } from "../../../utils";


import { displayAddRoutinePopupState, displayAddCategoryPopupState } from "../../../redux/popup/popup.actions";
import { selectCurrentCategories } from "../../../redux/categories/categories.selector";
// import { Button } from '@mui/material';
import { Button, Flex, Space } from 'antd';
import { blue ,} from '@ant-design/colors';
import AddRoutinePopup from "../../../components/add-routine-popup/add-routine-popup.component";
import { useEffect, useState } from "react";
import dayjs from "dayjs";


const OptionBarLayout = ({
	user,
	routines,
	labelFilterTags,
	selectedFilterOption,
	setSelectedFilterOption,
	displayAddCategoryPopupState,
	displayAddRoutinePopupState,
	setSelectedCategories,
	selectedCategory,
	setSelectedSort,
	categories,
	setSelectedDaysSchedule,
}) => {

	const [addRoutinePopup, setAddRoutinePopup] = useState({
		open : false,
	});

	let selectFilterOptions = [
		{ value: "all", label: "All routine" },
		{ value: "important", label: "Important" },
		{ value: "waiting", label: "Waiting" },
		{ value: "completed", label: "completed" },
		{ value:'archived', label:'Archived'},
		{ value:'unarchived', label:'Unarchived'},
	];

	selectFilterOptions = selectFilterOptions.map((option) => ({
		...option,
		label: `${option.label} (${labelFilterTags[option.value]})`,
	}));

	const selectCategoriesOptions = [];

	categories.forEach(category => {
		selectCategoriesOptions.push({
			value: category.categoryId,
			label : category.emoji + ' ' + category.label
		})
	})

	let selectSortOptions = [
		{ value: "difficulty", label: "Difficulty" },
		{ value: "priority", label: "Priority" },
	];


	return (
		<div className="option-bar">
			<Space
				wrap
				// className="option-bar__filter"
				>
				<Select
					options={selectFilterOptions}
					defaultValue={selectFilterOptions[selectFilterOptions.length - 1]}
					placeholder="select attribute..."
					style={{minWidth: '23rem'}}
					onChange={setSelectedFilterOption}
				/>
				<Select
					options={selectSortOptions}
					style={{minWidth: '23rem'}}
					placeholder="Sort by..."
					onChange={setSelectedSort}
				/>
				<Select
					options={selectCategoriesOptions}
					placeholder="Select category..."
					onChange={setSelectedCategories}
					style={{minWidth: '23rem'}}
					mode='tags'
					maxTagCount='responsive'
				/>

				<Select
					options={daysWeekOptions}
					placeholder="Select days..."
					defaultValue={daysWeekOptions[dayjs().day()]}
					onChange={setSelectedDaysSchedule}
					style={{minWidth: '23rem'}}
					mode='tags'
					maxTagCount='responsive'
				/>
				
			</Space>
			<Flex wrap="wrap" gap="small">
			<Button
					className="option-bar__routine-btn"
					type="primary"
					color='green'
					onClick={() => displayAddCategoryPopupState(false)}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						viewBox="0 0 20 20"
						height="20"
						fill="none"
						className="svg-icon"
					>
						<g strokeWidth="1.5" strokeLinecap="round" stroke="#fff">
							<circle r="7.5" cy="10" cx="10"></circle>
							<path d="m9.99998 7.5v5"></path>
							<path d="m7.5 9.99998h5"></path>
						</g>
					</svg>
					<span className="lable">Add category</span>
				</Button>
				<Button
					className="option-bar__category-btn"
					type="primary"
					color='blue'
					onClick={() => setAddRoutinePopup(old => ({...old, open: true}))}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						viewBox="0 0 20 20"
						height="20"
						fill="none"
						className="svg-icon"
					>
						<g strokeWidth="1.5" strokeLinecap="round" stroke="#fff">
							<circle r="7.5" cy="10" cx="10"></circle>
							<path d="m9.99998 7.5v5"></path>
							<path d="m7.5 9.99998h5"></path>
						</g>
					</svg>
					<span className="lable">Add routine</span>
				</Button>
				

			</Flex>
			< AddRoutinePopup 
				open={addRoutinePopup.open}
				categories={categories}
				onCancel={() => setAddRoutinePopup({open: false})}
				user={user}/>
		</div>
	);
};

const mapStateToProps = createStructuredSelector({
	user: selectCurrentUser,
	routines: selectCurrentRoutines,
	categories : selectCurrentCategories
});

const mapDispatchToProps = (dispatch) => ({
	displayAddRoutinePopupState: (state) =>
		dispatch(displayAddRoutinePopupState(state)),
	displayAddCategoryPopupState: (state) => 
		dispatch(displayAddCategoryPopupState(state))
});

export default connect(mapStateToProps, mapDispatchToProps)(OptionBarLayout);
