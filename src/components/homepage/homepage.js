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
    <div class="container" style={{ display:"flex", justifyContent:"center", alignItems:"center", height:"80vh", flexDirection:"column"}}>
        <h1 class="display-4">Page Under Development</h1>
        <p class="lead">We're working hard to bring you something awesome. Stay tuned!</p>
        <p class="mt-3">Estimated launch: Coming Soon</p>
    </div>
  )
}
