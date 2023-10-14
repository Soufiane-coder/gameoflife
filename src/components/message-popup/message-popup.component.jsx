
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
        <div className='message-content__window'>
            <Zoom duration={500}>
                <div className="message-content__popup">
                    <div className="message-content__head">
                        <MessageIcon className="message-content__message-icon" />
                        <h2 className="message-content__title">Your Message</h2>
                        <CloseIcon className="message-content__close-icon" onClick={() => hidePopup()} />
                    </div>
                    <p className="message-content__message">
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