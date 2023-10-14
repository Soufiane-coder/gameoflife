import { useState } from 'react';
import { ReactComponent as FilterIcon } from '../../assets/icons/filter.svg';
import './Filter.scss';
import { Zoom } from 'react-reveal';
const Filter = () => {
    const list = [
        'all routine',
        'important',
        'waiting',
        'completed',
    ]
    const [show, setShow] = useState(false);
    return (
        <div className='filter-drop-menu'>
            <FilterIcon className='filter-drop-menu__icon' onClick={() => setShow(!show)} />
            {
                <Zoom duration={500} when={show}>
                    <ul className='filter-drop-menu__list' style={!show ? { height: '0' } : {}}>
                        {
                            list.map((item, key) => (
                                <li key={key} className='filter-drop-menu__item'>{item}  <span className="tag">0</span></li>
                            ))
                        }
                    </ul>
                </Zoom>
            }
        </div>
    )
}

export default Filter;