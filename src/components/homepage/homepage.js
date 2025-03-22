import React, { useEffect, useState } from 'react'
import { getCurrentUser, findUserDetailsByUserName } from "../../Auth/UserServices";
export default function Homepage() {

  const [currentUser, setCurrentUser] = useState({});
  const [userRole, setUserRole] = useState("");
  const [loggedInUser, setLoggedInUser] = useState();
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser(); // Get the current user
      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user)); // Store in localStorage
        setCurrentUser(user);
        setUserRole(user.role);
      }
    }

    fetchUser();

    const message = sessionStorage.getItem("message");
    if (message) {
      setOpen(true);
    }

  }, []);
  
  
  // useEffect(()=>{
  //     setUser(currentUser);
  // },[currentUser])


  // async function setUser(current){
  //   console.log("Set User"+current);
  //   const token = localStorage.getItem("token");
  //   const decodedToken = jwtDecode(token);
  //   const username = decodedToken.sub;

  //   console.log(username);
  
    
  // }
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    console.log("Uploaded file:", file);
  }
  return (
    <div>
      <h1>This is homepage</h1>
      { currentUser ? <h1>Current User = {currentUser?.username || "Guest"}!</h1> : <h1>No user found</h1> }
      <h1>{ userRole || "dead" }</h1>
       <form>
        <div>
          <label htmlFor="fileUpload">Upload a file:</label>
          <input 
            type="file" 
            id="fileUpload" 
            name="fileUpload" 
            onChange={handleFileUpload} 
          />
        </div>
      </form>
    </div>
  )
}
