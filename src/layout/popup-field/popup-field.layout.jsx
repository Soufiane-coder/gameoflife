
import './popup-field.style.scss';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentPopup } from '../../redux/popup/popup.selector';
import { hidePopup } from '../../redux/popup/popup.actions';
import { popupActionTypes } from '../../redux/popup/popup.types';

import CheckPopup from '../../components/check-popup/check-popup.component';
import AddRoutinePopup from '../../components/add-routine-popup/add-routine-popup.component';
import MessagePopup from '../../components/message-popup/message-popup.component';

import ReactModal from 'react-modal';
import { Zoom } from 'react-reveal';
import AddCategoryPopupComponent from '../../components/add-category-popup/add-category-popup.component';

const PopupField = ({ popup , hidePopup}) => {
    if(
        popup.type !== popupActionTypes.MESSAGE_POPUP &&
        popup.type !== popupActionTypes.ADD_ROUTINE_POPUP &&
        popup.type !== popupActionTypes.ADD_CATEGORY_POPUP &&
        popup.type !== popupActionTypes.CHECK_POPUP
    ){
        return;
    }

    const choosePopup = () => {
        switch (popup.type) {
            case popupActionTypes.MESSAGE_POPUP:
                return (
                    <MessagePopup routineId={popup.payload} />
                )
            case popupActionTypes.ADD_ROUTINE_POPUP:
                return (
                    <AddRoutinePopup editThisRoutine={popup.payload}/>
                )
            case popupActionTypes.CHECK_POPUP:
                return (
                    <CheckPopup routineId={popup.payload} />
                )
            case popupActionTypes.ADD_CATEGORY_POPUP:
                return (
                    <AddCategoryPopupComponent/>
                )
            case popupActionTypes.HIDE_POPUP:
                return null;
            default: return null;
        }
    }

    const handleCloseModal = () => {
        hidePopup()
    }
    
    return (
        <div className="popup-model">
        <ReactModal
          isOpen={true}
          contentLabel="onRequestClose Example"
          onRequestClose={handleCloseModal}
          ariaHideApp={false}
        >
          <Zoom>
            <div className="popup-model__wrapper">
              {
                choosePopup()
              }
            </div>
          </Zoom>
        </ReactModal> 
      </div>
    )

}
const mapStateToProps = createStructuredSelector({
    popup: selectCurrentPopup
})

const mapDispatchToProps = (dispatch) => ({
    hidePopup: () => dispatch(hidePopup())
})
export default connect(mapStateToProps, mapDispatchToProps)(PopupField);