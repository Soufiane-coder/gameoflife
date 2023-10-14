import './UserBar.scss';
import Goku from '../../assets/badjets/goku_1-stand.gif';
import { ReactComponent as CoinIcon } from '../../assets/icons/coin-icon.svg';
const UserBar = ({ user }) => {

    return (
        <div className="user-bar">
            {/* <div className="user-bar__tree-lines">
                <div className="user-bar__line-one" />
                <div className="user-bar__line-two" />
                <div className="user-bar__line-three" />
            </div> */}
            

            <div className="user-bar__rate">
                <div className="et checked">★</div>
                <div className="et">★</div>
                <div className="et">★</div>
                <div className="et">★</div>
                <div className="et">★</div>
            </div>
            <p className='user-bar__coins-wrapper'>{user?.coins}<CoinIcon className='user-bar__coins-clipart' /></p>
            <img src={user?.photoURL} alt="user" className="user-bar__user-img" />
            {/* <img className="user-bar__character" src={Goku} alt="" /> */}
            <div className="user-bar__username">{user?.displayName}</div>
        </div>
    )

}

export default UserBar;