import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

const { REACT_APP_SERVER_URL } = process.env;

const EditAccount = (props) => {
  const [nameField, setnameField] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (!nameField && props.user) {
      if (props.user.type === 'user') {
        setnameField(props.user.userName);
        setEmail(props.user.email);
        setFirstName(props.user.firstName);
        setLastName(props.user.lastName);
      } else if (props.user.type === 'restaurant') {
        setnameField(props.user.name);
        setEmail(props.user.email);
        setCategory(props.user.category[0]);
      }
    }
  }, [props.user])

  if (props.user.type === 'user') {
  
    const handleUserName = (e) => {
      setnameField(e.target.value);
    };
    const handleEmail = (e) => {
      setEmail(e.target.value);
    };
    const handleOldPassword = (e) => {
      setOldPassword(e.target.value);
    };
    const handleNewPassword = (e) => {
      setNewPassword(e.target.value);
    };
    const handleConfirmPassword = (e) => {
      setConfirmPassword(e.target.value);
    };
    const handleFirstName = (e) => {
      setFirstName(e.target.value);
    };
    const handleLastName = (e) => {
      setLastName(e.target.value);
    };

    const handleSubmit = (e) => {
      e.preventDefault(); 
      // at the beginning of a submit function
      // make sure password and confirm password are equal
      // password length >= 8 characters
      
      const editedUser = {
        userName: nameField,
        email,
        firstName,
        lastName,
      };
      // look at password stuff for errors
      // if no password information is given, just skip
      if (oldPassword && newPassword && confirmPassword) {
        if (!oldPassword || !newPassword || !confirmPassword) return props.createNotification("error", "Incomplete Password Field(s)");
        if (newPassword !== confirmPassword) return props.createNotification("error", "Passwords Don't Match!");
        if (newPassword.length < 8) return props.createNotification("error", "Password needs to be at least 8 characters.");

        editedUser.oldPassword = oldPassword;
        editedUser.newPassword = newPassword;
      }
      
      axios
        .put(`${REACT_APP_SERVER_URL}/users/${props.user._id}/edit`, editedUser)
        .then((response) => {
          props.createNotification("success", `Profile Edited Successfully!`);
          // Go ahead and refresh after that. should fix token problems
          setTimeout(() => {
            props.history.go(0);
          }, 500);
        })
        .catch((error) => {
          try {
            const list = Object.keys(error.response.data.needToChange).map((item) => {
              if (item === 'userName') {
                return 'Username Is Taken. \n';
              } else if (item === 'email') {
                return 'Email Already In Use. \n';
              } else if (item === 'password') {
                return 'Password Has To Be At Least 8 Charaters. \n';
              } else {
                return item;
              }
            });
            props.createNotification("error", `An Error Occured: \n ${list}`);
          } catch (findError) {
            console.error(findError);
            props.createNotification("error", `An Error Occured, Please Try Again`);
          }
          console.log("===> Error in Edit", error);
          props.createNotification("error", `An Error Occured, Please Try Again`);
        });
    };
  
    return (
      <div className="col-xs col-md row mb-5">
        <div className="col-xs col-md mt-3 mt-md-0 column">
          <h2>Edit Profile</h2>
          <hr></hr>
          <form onSubmit={handleSubmit}>
            <h3>Login</h3>
            <div className="form-floating mb-3">
              <input onChange={handleEmail} name="email" type="email" className="form-control" id="floatingInput" placeholder={props.user.email} />
              <label htmlFor="floatingInput">{props.user.email}</label>
              <span>Email Address</span>
            </div>
            <h3>Security</h3>
            <div className="form-floating mb-3">
              <input onChange={handleOldPassword} type="password" name="oldPassword" className="form-control" id="floatingOld" placeholder="Password" />
              <label htmlFor="floatingPassword">Old Password</label>
            </div>
            <div className="form-floating mb-3">
              <input onChange={handleNewPassword} type="password" className="form-control" id="floatingNewPassword" placeholder="New Password" />
              <label htmlFor="floatingNewPassword">New Password</label>
            </div>
            <div className="form-floating mb-3">
              <input onChange={handleConfirmPassword} type="password" className="form-control" id="floatingConfirmPassword" placeholder="Confirm Password" />
              <label htmlFor="floatingConfirmPassword">Confirm Password</label>
            </div>
    
            <h3>Identity</h3>
            <div className="row">
              <div className="form-floating mb-3 col-md">
                <input onChange={handleFirstName} type="text" name="firstName" className="form-control" id="floatingFirstName" placeholder={props.user.firstName} />
                <label htmlFor="floatingFirstName">{props.user.firstName}</label>
                <span>First Name</span>
              </div>
              <div className="form-floating mb-3 col-md">
                <input onChange={handleLastName} type="text" name="lastName" className="form-control" id="floatingLastName" placeholder={props.user.firstName} />
                <label htmlFor="floatingLastName">{props.user.lastName}</label>
                <span>Last Name</span>
              </div>
            </div>
            <div className="form-floating mb-3">
              <input onChange={handleUserName} type="text" name="user" className="form-control" id="floatingUserName" placeholder={props.user.userName} />
              <label htmlFor="floatingUserName">{props.user.userName}</label>
              <span>Username</span>
            </div>
            
    
            <button type="submit" className="btn btn-success my-4">Confirm Changes</button>
          </form>
        </div>
  
        <div className="col-xs col-md w-100 d-flex justify-content-center">
          <img className="profile-picture-edit" src={props.user.profileUrl} alt="Your profile-img" />
        </div>
      </div>
    );
  } else if (props.user.type === 'restaurant') {
    const handleName = (e) => {
      setnameField(e.target.value);
    };
    const handleEmail = (e) => {
      setEmail(e.target.value);
    };
    const handleOldPassword = (e) => {
      setOldPassword(e.target.value);
    };
    const handleNewPassword = (e) => {
      setNewPassword(e.target.value);
    };
    const handleConfirmPassword = (e) => {
      setConfirmPassword(e.target.value);
    };
    const handleCategory = (e) => {
      setCategory(e.target.value);
    }

    const handleSubmit = (e) => {
      e.preventDefault(); 
      // at the beginning of a submit function
      // make sure password and confirm password are equal
      // password length >= 8 characters
      
      const editedRestaurant = {
        name: nameField,
        email,
        category,
      };
      // look at password stuff for errors
      // if no password information is given, just skip
      if (oldPassword && newPassword && confirmPassword) {
        if (!oldPassword || !newPassword || !confirmPassword) return props.createNotification("error", "Incomplete Password Field(s)");
        if (newPassword !== confirmPassword) return props.createNotification("error", "Passwords Don't Match!");
        if (newPassword.length < 8) return props.createNotification("error", "Password needs to be at least 8 characters.");

        editedRestaurant.oldPassword = oldPassword;
        editedRestaurant.newPassword = newPassword;
      }
      
      axios
        .put(`${REACT_APP_SERVER_URL}/restaurants/${props.user._id}/edit`, editedRestaurant)
        .then((response) => {
          props.createNotification("success", `Profile Edited Successfully!`);
          // Go ahead and refresh after that. should fix token problems
          setTimeout(() => {
            props.history.go(0);
          }, 500);
        })
        .catch((error) => {
          try {
            const list = Object.keys(error.response.data.needToChange).map((item) => {
              if (item === 'userName') {
                return 'Username Is Taken. \n';
              } else if (item === 'email') {
                return 'Email Already In Use. \n';
              } else if (item === 'password') {
                return 'Password Has To Be At Least 8 Charaters. \n';
              } else {
                return item;
              }
            });
            props.createNotification("error", `An Error Occured: \n ${list}`);
          } catch (findError) {
            console.error(findError);
            props.createNotification("error", `An Error Occured, Please Try Again`);
          }
          console.log("===> Error in Edit", error);
          props.createNotification("error", `An Error Occured, Please Try Again`);
        });
    };
  
    return (
      <div className="col-xs col-md row mb-5">
        <div className="col-xs col-md mt-3 mt-md-0 column">
          <h2>Edit Profile</h2>
          <hr></hr>
          <form onSubmit={handleSubmit}>
            <h3>Login</h3>
            <div className="form-floating mb-3">
              <input onChange={handleEmail} name="email" type="email" className="form-control" id="floatingInput" placeholder={props.user.email} />
              <label htmlFor="floatingInput">{props.user.email}</label>
              <span>Email Address</span>
            </div>
            <h3>Security</h3>
            <div className="form-floating mb-3">
              <input onChange={handleOldPassword} type="password" name="oldPassword" className="form-control" id="floatingOld" placeholder="Password" />
              <label htmlFor="floatingPassword">Old Password</label>
            </div>
            <div className="form-floating mb-3">
              <input onChange={handleNewPassword} type="password" className="form-control" id="floatingNewPassword" placeholder="New Password" />
              <label htmlFor="floatingNewPassword">New Password</label>
            </div>
            <div className="form-floating mb-3">
              <input onChange={handleConfirmPassword} type="password" className="form-control" id="floatingConfirmPassword" placeholder="Confirm Password" />
              <label htmlFor="floatingConfirmPassword">Confirm Password</label>
            </div>
    
            <h3>Identity</h3>
            <div className="form-floating mb-3">
              <input onChange={handleName} type="text" name="restaurant" className="form-control" id="floatingName" placeholder={props.user.name} />
              <label htmlFor="floatingName">{props.user.name}</label>
              <span>Username</span>
            </div>

            <select onChange={handleCategory} value={category} className="form-select" aria-label="multiple category select">
              <option value="">Category</option>
              <option value={"breakfast"}>Breakfast</option>
              <option value={"brunch"}>Brunch</option>
              <option value={"lunch"}>Lunch</option>
              <option value={"dinner"}>Dinner</option>
              <option value={"ramen"}>Ramen</option>
              <option value={"japanese"}>Japanese</option>
              <option value={"thai"}>Thai</option>
              <option value={"mexican"}>Mexican</option>
              <option value={"vegetarian"}>Vegetarian</option>
              <option value={"vegan"}>Vegan</option>
              <option value={"halal"}>Halal</option>
              <option value={"mediterranean"}>Mediterranean</option>
              <option value={"itlaian"}>Italian</option>
              <option value={"chinese"}>Chinese</option>
            </select>
            
            <button type="submit" className="btn btn-success my-4">Confirm Changes</button>
          </form>
        </div>
  
        <div className="col-xs col-md w-100 d-flex justify-content-center">
          <img className="profile-picture-edit" src={props.user.profileUrl} alt="Your profile-img" />
        </div>
      </div>
    );
  } else {
    return (
      <>
        <div>
          An Error Occured!
        </div>
      </>
    );
  }

}

export default EditAccount;
