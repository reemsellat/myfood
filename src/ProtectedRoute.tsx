import { User } from "firebase/auth"
import { Navigate } from "react-router-dom"
function ProtectedRoute(user:User,children:any){

   if(!user){
    return <Navigate to="/" replace></Navigate>
   }
   return children
}

export default ProtectedRoute