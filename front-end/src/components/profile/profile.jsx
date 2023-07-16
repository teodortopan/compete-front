import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './profile.css';

const Profile = ({ username, setUserId }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  // const [isHovered, setIsHovered] = useState(false);
  const [profilePicture, setProfilePicture] = useState('data:image/jpeg;base64,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')
  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/user/${username}`);
        setUserData(response.data);
        localStorage.setItem('userId', response.data.user_id)
        console.log(response.data.user_id)
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    getUserData();
  }, [username]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const logOut = () => {
    localStorage.setItem('token', '');
    localStorage.setItem('username', '');

    navigate('/');
    window.location.reload();
  };

  // const handleProfilePictureChange = async (event) => {
  //   console.log('Handling profile picture change');
  //   const file = event.target.files[0];
  //   console.log(file)
  //   if (file) {
  //     const formData = new FormData();
  //     formData.append('profile_picture', file);
  //     console.log(formData)
  //     try {
  //       const response = await axios.post(`http://localhost:3000/user/${username}/profile-picture`, formData, {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //         },
  //       });
  //       console.log('profile picture changed')
  //       // Update the profile picture in the UI
  //       setProfilePicture(response.data.profile_picture)
  //     } catch (error) {
  //       console.error('Error updating profile picture:', error);
  //     }
  //   }
  // }
  const cameraIcon = 'data:image/png;base64,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'
  return (
    <div className="profile-container">
      <h2 className="profile-heading">Profile</h2>
      <div className="profile-picture-container">
        <div
          className='profile-picture'
          style={{
            backgroundImage: `url(${userData.profile_picture || profilePicture})`,
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* {isHovered && (
            <>
              <input
                type="file"
                id="profile-picture-upload"
                accept="image/*"
                onChange={handleProfilePictureChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="profile-picture-upload" className="profile-picture-button">
                <img src={cameraIcon} alt="Camera Icon" className="camera-icon" />
              </label>
            </>
          )} */}
        </div>
      </div>
      <p className="profile-name">
        <strong>Name:</strong> {userData.first_name} {userData.last_name}
      </p>
      <p className="profile-username">
        <strong>Username:</strong> {userData.username}
      </p>
      <p className="profile-email">
        <strong>Email:</strong> {userData.email}
      </p>
      <button className="profile-button" onClick={logOut}>
        Log Out
      </button>
    </div>
  );
};

export default Profile;