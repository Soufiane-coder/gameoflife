import './check-popup.style.scss';

import React from 'react'
import { Input, Modal } from 'antd'
import RoutineType from '../../types/routine.type';

interface PropsType {
    open : boolean;
    onCancel : () => void;
    routine: RoutineType;
}

const CheckRoutinePopup: React.FC<PropsType>= ({open, onCancel, routine}) => {
  return (
    <Modal
        title={
            <b>Check routine</b>
        }
        style={{fontFamily: 'Quicksand'}}
        open={open} 
        // onOk={onOk}
        // style={{top: 60}}
        onCancel={onCancel}
        okText='Check this routine'
        okType='primary'
        okButtonProps={{color: 'green'}}
        // footer={footer}
    >
        <p className="message-window__description">Write a message for future you to motivate, noting the progress or planing the next step</p>
        <Input placeholder={routine.message}/>

    </Modal>
  )
}

export default CheckRoutinePopup
