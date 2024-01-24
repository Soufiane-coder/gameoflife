
import './MessageContent.scss';
import { ReactComponent as MessageIcon } from '../../assets/icons/message.svg';
import { ReactComponent as CloseIcon } from '../../assets/icons/close.svg';
import { Zoom } from 'react-reveal';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { selectMessage } from '../../redux/routines/routines.selector';
import { hidePopup } from '../../redux/popup/popup.actions';

const MessagePopup = ({ routineId, message, hidePopup }) => {
    return (
        <div className='message-content-window'>
            <Zoom duration={500}>
                <div className="popup-window message-content-window__popup">
                    <div className="popup-window__head message-content-window__head">
                        <MessageIcon className="popup-window__icon message-content-window__message-icon" />
                        <h3 className="message-content-window__title">Your Message</h3>
                        <CloseIcon className="popup-window__close-icon" onClick={() => hidePopup()} />
                    </div>
                    <p className="message-content-window__message">
                        {
                            message(String(routineId))
                        }
                    </p>
                </div>
            </Zoom>
        </div>
    )
}

const mapStateToProps = createStructuredSelector({
    message: selectMessage
})

const mapDispatchToProps = (dispatch) => ({
    hidePopup: () => dispatch(hidePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(MessagePopup);