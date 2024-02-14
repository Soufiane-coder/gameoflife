import './setting-sidebar.style.scss';
import LogoGOL from '../../../assets/clipart/game_of_life_clipart.svg';
import {ReactComponent as AccountCircleIcon} from '../../../assets/icons/account_circle.svg';
import {ReactComponent as PaletteIcon} from '../../../assets/icons/palette.svg';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';


const SettingSidebar = () => {
    const menuItemStyles = {
        // root: {
        //   fontSize: '13px',
        //   fontWeight: 400,
        // },
        // icon: {
        //   color: themes[theme].menu.icon,
        //   [`&.${menuClasses.disabled}`]: {
        //     color: themes[theme].menu.disabled.color,
        //   },
        // },
        // SubMenuExpandIcon: {
        //   color: '#b6b7b9',
        // },
        // subMenuContent: ({ level }) => ({
        //   backgroundColor:
        //     level === 0
        //       ? hexToRgba(themes[theme].menu.menuContent, hasImage && !collapsed ? 0.4 : 1)
        //       : 'transparent',
        // }),
        // icon:{
        //     '&:hover': {
        //         backgroundColor: 'red',
        //         fill: '#FAFAFA',
        //         },
        // },
        button: {
        //   [`&.${menuClasses.disabled}`]: {
        //     color: 'red',
        //   },
          '&:hover': {
            backgroundColor: '#00924560',
            color: '#FAFAFA',
          },

          '&:active': {
            backgroundColor: '#00924590',
            color: '#FAFAFA',
          },
          '&:focus': {
            backgroundColor: '#009245',
            color: '#FAFAFA',
          },
        },
        // label: ({ open }) => ({
        //   fontWeight: open ? 600 : undefined,
        // }),
      };
    return (
        <Sidebar collapsed>
            <img src={LogoGOL} alt="" className="settings__logo-img" />
            <Menu menuItemStyles={menuItemStyles}>
                <MenuItem 
                    icon={<AccountCircleIcon/>}
                    component={<Link to="/settings/profile" />}> Profile </MenuItem>
                <MenuItem 
                    icon={<PaletteIcon/>}
                    component={<Link to="/settings/appearance" />}> Appearance </MenuItem>
                <SubMenu label="Charts">
                    <MenuItem> Pie charts </MenuItem>
                    <MenuItem> Line charts </MenuItem>
                </SubMenu>
            </Menu>
        </Sidebar>
    )
}

export default SettingSidebar