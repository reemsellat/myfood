
import { useAuth } from "./AuthContext";
function topBarLoggedIn() {
    const { logOut } = useAuth()
    const handleonLogOut = async () => {
        await logOut()
    }
    return (
        <div className="top-bar-logged-in">
            <button onClick={handleonLogOut}>Log out</button>
        </div>
    )
}
export default topBarLoggedIn