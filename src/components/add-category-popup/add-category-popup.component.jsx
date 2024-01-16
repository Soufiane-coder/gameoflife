import './add-category-popup.style.scss';
import { useState } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { hidePopup } from "../../redux/popup/popup.actions";
import { selectCurrentUser } from "../../redux/user/user.selector";
import {addCategoryToFirebase} from '../../../lib/firebase';

import Ripples from 'react-ripples'


import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const AddCategoryPopup = ({
    user,
    hidePopup
}) => {

	const [showEmojiList, setShowEmojiList] = useState(false);
    const [categoryForm, setCategoryForm] = useState({emoji: '', label : ''})

    const handleEmoji = (emoji) => {
		setCategoryForm(oldState => ({...oldState, emoji: emoji.native}));
		setShowEmojiList(false);
	};

    const handleCategoryLabel = (event) => {
        const {value} = event.target
        console.log(value)
        setCategoryForm(oldState => ({...oldState, label: value}))
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        addCategoryToFirebase(user.uid, categoryForm)
        hidePopup()
    }

    return (
        <div className="add-category-popup">
            {
                showEmojiList && (
                    <Picker
                        className="add-routine-window__emoji-list"
                        data={data}
                        onEmojiSelect={handleEmoji}
                    />
                )
            }
            <div className="add-category-popup__emoji-selection"
            onClick={() => {setShowEmojiList(true)}}>
                {
                    categoryForm.emoji !== '' ? <span>{categoryForm.emoji}</span> :
                    <Ripples onClick={() => {setShowEmojiList(true)}}>
                        <button className='btn-info'>select emoji...</button>
                    </Ripples>
                }
            </div>
            <input 
                className="add-category-popup__category-label-input"
                type="text"
                value={categoryForm.label}
                onChange={handleCategoryLabel}/>
            <Ripples>
                <button className='btn-success' onClick={handleSubmit}>add Category</button>
            </Ripples>
        </div>
    )
}

const mapStateToProps = createStructuredSelector({
    user: selectCurrentUser,
})

const mapDispatchToProps = (dispatch) => ({
	hidePopup: () => dispatch(hidePopup()),
});


export default connect(mapStateToProps, mapDispatchToProps)(AddCategoryPopup);