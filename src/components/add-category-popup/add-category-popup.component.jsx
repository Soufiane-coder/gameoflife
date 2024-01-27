import './add-category-popup.style.scss';
import { useState } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { hidePopup } from "../../redux/popup/popup.actions";
import { selectCurrentUser } from "../../redux/user/user.selector";
import {addCategoryToFirebase} from '../../../lib/firebase';
import {ReactComponent as CategoryIcon} from '../../assets/icons/category.svg';
import {ReactComponent as CloseIcon} from '../../assets/icons/close.svg';
import { Button } from '@mui/material';


import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const AddCategoryPopup = ({
    user,
    hidePopup,
}) => {
	const [showEmojiList, setShowEmojiList] = useState(false);
    const [categoryForm, setCategoryForm] = useState({emoji: '🤖', label : ''})

    const handleEmoji = (emoji) => {
		setCategoryForm(oldState => ({...oldState, emoji: emoji.native}));
		setShowEmojiList(false);
	};

    const handleCategoryLabel = (event) => {
        const {value} = event.target
        setCategoryForm(oldState => ({...oldState, label: value}))
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        console.log('submited')
        addCategoryToFirebase(user.uid, categoryForm)
        hidePopup()
    }

    return (
        <div className="add-category-window">
            {
                showEmojiList && (
                    <Picker
                        className="add-routine-window__emoji-list"
                        data={data}
                        onEmojiSelect={handleEmoji}
                    />
                )
            }
            <form className="popup-window add-category-window__popup" onSubmit={handleSubmit}>
                <div className="popup-window__head add-category-window__head">
                    <CategoryIcon className="popup-window__icon" />
                    <h3 className="add-category-window__title">
                        Add routine
                    </h3>
                    <CloseIcon
                        className="popup-window__close-icon"
                        onClick={() => {
                            hidePopup(false);
                        }}
                    />
                </div>
                <p className="add-category-window__description">
                    Add categories to organize your routine and avoid forgetting any tasks.
                </p>
                <span className='add-category-window__emoji'>
                    {categoryForm.emoji}
                </span>
                <input 
                    className="add-category-window__category-label-input"
                    type="text"
                    value={categoryForm.label}
                    onChange={handleCategoryLabel}
                    required
                    />

                    <Button 
                        className='popup-window__button add-category-window__btn'
                        color='info'
                        variant='contained'
                        type='button'
                        onClick={() => {setShowEmojiList(true)}}
                        >
                        Change emoji
                    </Button>

                    <Button 
                        className='popup-window__button add-category-window__btn'
                        color='success'
                        variant='contained'
                        type='submit'
                    >
                        Add category
                    </Button>
                
            </form>
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