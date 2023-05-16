
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import './styles/navigateBar.css';
import Icon from '@mdi/react';
import { mdiMenu } from '@mdi/js';
import { mdiClose } from '@mdi/js';
function NavigationBar() {
    const navigate = useNavigate()
    const handleonRegister = () => {
        navigate('/register')
    }
    const showHamburgerNavMenu = () => {
        
        const menu = document.getElementsByClassName("hamburger-nav-menu")[0] as HTMLDivElement
       
        menu.style.right='0'

    }
    const hideHamburgerNavMenu = () => {
        const menu = document.getElementsByClassName("hamburger-nav-menu")[0] as HTMLDivElement
        menu.style.right="-360px"
    }
    return (
        <div>
            <div className="navigation-bar">
                <div id="part-1"><h1>my food</h1></div>

                <div id="part-2">

                    <NavLink to='/'>Home </NavLink><span></span>
                    <NavLink to='/about-us'>About </NavLink><span></span>
                    <NavLink to='/reviews'>Reviews</NavLink>

                </div>
                <div id="part-3">
                    <button className="register" onClick={handleonRegister}>Register</button>
                    <div className="hamburger-icon" onClick={showHamburgerNavMenu}>
                        <Icon path={mdiMenu} size={1.1} />
                    </div>

                </div>
            </div>
            <div className="hamburger-nav-menu">
                <div><button className="close" onClick={hideHamburgerNavMenu}><Icon path={mdiClose} size={1} /></button></div>
                <NavLink to='/'>Home </NavLink>
                <NavLink to='/about-us'>About </NavLink>
                <NavLink to='/reviews'>Reviews</NavLink>
                <NavLink style={{color:"#B9B9B9"}} to='/register'>Register or log in</NavLink>
                

            </div>

            <Outlet></Outlet>
        </div>
    )
}

export default NavigationBar