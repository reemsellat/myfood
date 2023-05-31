
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Icon from '@mdi/react';
import { mdiShoppingOutline } from '@mdi/js';
import { mdiLogout } from '@mdi/js';
import { mdiMagnify } from '@mdi/js';
import { mdiMenu } from "@mdi/js";
import { getAuth } from "firebase/auth";
import { mdiClose } from "@mdi/js";
import { useEffect } from "react";
import SearchBar from "./SearchBar";
function NavigationBarLoggedIn() {
    const navigate = useNavigate()
    const { getDefaultShoppingBasketCount } = useAuth()
    const { shoppingBasketCount } = useAuth()
    const showHamburgerNavMenu = () => {

        const menu = document.getElementsByClassName("login-hamburger-nav-menu")[0] as HTMLDivElement

        menu.style.right = '0'

    }
    const hideHamburgerNavMenu = () => {
        const menu = document.getElementsByClassName("login-hamburger-nav-menu")[0] as HTMLDivElement
        menu.style.right = "-360px"
    }

    const { logOut } = useAuth()
    const handleonLogOut = async () => {
        await logOut()
    }
    useEffect(() => {
        navigate('/myfood/categories')
        getDefaultShoppingBasketCount()

    }, [])
    useEffect(() => {
        const shoppingBasket = document.getElementsByClassName('shopping-basket')
        for (let i = 0; i < shoppingBasket.length; i++) {
            const span = shoppingBasket[i].getElementsByTagName('span')[0] as HTMLElement
            if (shoppingBasketCount === 0) {

                span.style.visibility = "hidden"
            }
            else {
                span.style.visibility = "visible"
            }
        }

    }, [shoppingBasketCount])
    return (
        <div >
            <div className="login-top-navigation-bar">
                <div id="part-1">
                    <Icon path={mdiMagnify} size={1} rotate={90} />
                    <SearchBar></SearchBar>
                </div>
                <div id="part-2">
                    <button onClick={() => { navigate('/myfood/payment') }} className="shopping-basket"><Icon path={mdiShoppingOutline} size={1} /><span>{shoppingBasketCount}</span></button>
                    <button className="log-out" onClick={handleonLogOut}><Icon path={mdiLogout} size={1} /></button>
                </div>


            </div>
            <div className="login-navigation-bar">
                <h1>my food</h1>
                <div className="profile-image"></div>
                <h2>{getAuth().currentUser?.displayName}</h2>
                <NavLink style={({ isActive }) => ({ backgroundColor: isActive ? "rgb(252, 72, 102)" : "transparent" })} to='/myfood/categories' ><p>Categories</p></NavLink>
                <NavLink style={({ isActive }) => ({ backgroundColor: isActive ? "rgb(252, 72, 102)" : "transparent" })} to='/myfood/payment' ><p>Payment</p></NavLink>
                <NavLink style={({ isActive }) => ({ backgroundColor: isActive ? "rgb(252, 72, 102)" : "transparent" })} to='/myfood/about-us'><p>About us</p></NavLink>

            </div>
            <div className="login-top-navigation-bar-small-devices">
                <div id="part-1">
                    <h1>my food</h1>
                </div>
                <div id="part-2">
                    <button className="shopping-basket" onClick={() => { navigate('/myfood/payment') }}><Icon path={mdiShoppingOutline} size={1} /><span>{shoppingBasketCount}</span></button>
                    <div className="hamburger-icon" onClick={showHamburgerNavMenu}>
                        <Icon path={mdiMenu} size={1.1} />
                    </div>
                </div>


            </div>
            <div className="login-hamburger-nav-menu">
                <div><button className="close" onClick={hideHamburgerNavMenu}><Icon path={mdiClose} size={1} /></button></div>
                <div id="part-1">
                    <div className="profile-image"></div>
                    <h3>{getAuth().currentUser?.displayName}</h3>
                </div>
                <NavLink to='/myfood/categories' ><p>Categories</p></NavLink>
                <NavLink to='/myfood/payment' ><p>Payment</p></NavLink>
                <NavLink to='/myfood/about-us'><p>About us</p></NavLink>
           

                <div id="part-3">
                    <Icon path={mdiMagnify} size={1} rotate={90} />
                    <SearchBar></SearchBar>
                </div>
                <a id="part-4" onClick={handleonLogOut}>Log out</a>

            </div>

            <Outlet></Outlet>
        </div>
    )
}

export default NavigationBarLoggedIn