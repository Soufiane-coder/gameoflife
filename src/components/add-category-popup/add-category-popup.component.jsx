import './add-category-popup.style.scss';
import { useState } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { hidePopup } from "../../redux/popup/popup.actions";
import { selectCurrentUser } from "../../redux/user/user.selector";
import {addCategoryToFirebase} from '../../../lib/firebase';

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const AddCategoryPopup = ({
    user,
    hidePopup
}) => {

	const [showEmojiList, setShowEmojiList] = useState(false);
    const [categoryForm, setCategoryForm] = useState({emoji: '', categoryLabel : ''})

    const handleEmoji = (emoji) => {
		setCategoryForm(old => ({...old, emoji: emoji.native}));
		setShowEmojiList(false);
	};

    const handleCategoryLabel = (event) => {
        const {value} = event.target
        setCategoryForm(oldState => ({...oldState, label: value}))
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        console.log(event)
        addCategoryToFirebase(user.uid, categoryForm)
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
                    <button>select emoji...</button>
                }
            </div>
            <input type="text" value={categoryForm.categoryLabel} onChange={handleCategoryLabel}/>
            <button onClick={handleSubmit}>add Category</button>
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