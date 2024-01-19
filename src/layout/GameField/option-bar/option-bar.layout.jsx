import React, { useEffect } from "react";
import { ReactComponent as CoinIcon } from "../../../assets/icons/coin-icon.svg";
import "./option-bar.style.scss";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectCurrentUser } from "../../../redux/user/user.selector";
import { selectCurrentRoutines } from "../../../redux/routines/routines.selector";
import { useState } from "react";

import Filter from "../../../components/Filter/Filter";

import Select from "react-select";
import makeAnimated from 'react-select/animated';

import { customStyles } from "./styles";

import { displayAddRoutinePopupState, displayAddCategoryPopupState } from "../../../redux/popup/popup.actions";
import { selectCurrentCategories } from "../../../redux/categories/categories.selector";

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
			label : category.label
		})
	})

	const handleChoosingCategory = (selectedCategories) => {
		setSelectedCategories(selectedCategories);
	};

	const handleChoosingFilter = (event) => {
		setSelectedFilterOption(event.value);
	};

	return (
		<div className="option-bar">
			<Select
				options={selectFilterOptions}
				defaultValue={selectFilterOptions[selectFilterOptions.length - 1]}
				placeholder="select attribute..."
				styles={customStyles}
				onChange={handleChoosingFilter}
				components={animatedComponents}
			/>
			<Select
				options={selectCategoriesOptions}
				
				placeholder="select category..."
				styles={customStyles}
				onChange={handleChoosingCategory}
				components={animatedComponents}
				isMulti
			/>
			<button
				className="adding-routine-button"
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
					<g strokeWidth="1.5" strokeLinecap="round" stroke="#de8a2a">
						<circle r="7.5" cy="10" cx="10"></circle>
						<path d="m9.99998 7.5v5"></path>
						<path d="m7.5 9.99998h5"></path>
					</g>
				</svg>
				<span className="lable">Add routine</span>
			</button>
			<button
				className="adding-routine-button"
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
					<g strokeWidth="1.5" strokeLinecap="round" stroke="#de8a2a">
						<circle r="7.5" cy="10" cx="10"></circle>
						<path d="m9.99998 7.5v5"></path>
						<path d="m7.5 9.99998h5"></path>
					</g>
				</svg>
				<span className="lable">Add category</span>
			</button>
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
