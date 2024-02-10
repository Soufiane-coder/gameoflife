import { ReactComponent as CoinIcon } from "../../../assets/icons/coin-icon.svg";
import "./option-bar.style.scss";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectCurrentUser } from "../../../redux/user/user.selector";
import { selectCurrentRoutines } from "../../../redux/routines/routines.selector";

import Filter from "../../../components/Filter/Filter";

import Select from "react-select";
import makeAnimated from 'react-select/animated';

import { customStyles } from "./styles";

import { displayAddRoutinePopupState, displayAddCategoryPopupState } from "../../../redux/popup/popup.actions";
import { selectCurrentCategories } from "../../../redux/categories/categories.selector";
import { Button } from '@mui/material';

const animatedComponents = makeAnimated();

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
}) => {
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
		{ value: "level", label: "Level" },
		{ value: "priority", label: "Priority" },
	];

	const handleChoosingCategory = (selectedCategories) => {
		setSelectedCategories(selectedCategories);
	};

	const handleChoosingFilter = (event) => {
		setSelectedFilterOption(event.value);
	};

	const handleChoosingSort = (event) => {
		setSelectedSort(event.value)
	}

	return (
		<div className="option-bar">
			<div className="option-bar__filter">
				<Select
					options={selectFilterOptions}
					defaultValue={selectFilterOptions[selectFilterOptions.length - 1]}
					placeholder="select attribute..."
					styles={customStyles}
					onChange={handleChoosingFilter}
					components={animatedComponents}
					isSearchable={false}
				/>
				<Select
					options={selectSortOptions}
					// defaultValue={selectSortOptions[selectSortOptions.length - 1]}
					placeholder="Sort by..."
					styles={customStyles}
					onChange={handleChoosingSort}
					components={animatedComponents}
					isSearchable={false}
				/>
				<Select
					options={selectCategoriesOptions}
					
					placeholder="Select category..."
					styles={customStyles}
					onChange={handleChoosingCategory}
					components={animatedComponents}
					isSearchable={false}
					isMulti
				/>
				
			</div>
			<div className="option-bar__btns">
			<Button
					className="popup-window__button adding-routine-button"
					variant='contained'
					color='info'
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
					className="popup-window__button adding-routine-button"
					variant='contained'
					color='success'
					onClick={() => displayAddRoutinePopupState(false)}
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
				

			</div>
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
