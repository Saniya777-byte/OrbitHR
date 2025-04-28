import React from 'react';

const Header = ({ changeUser, data }) => {
  const logOutUser = () => {
    // 1. Clear the authentication data
    localStorage.removeItem('loggedInUser');
    
    // 2. Reset the user state in parent component
    changeUser(null);  // This should trigger the App.js to show login screen
    
    // 3. Optional: Force refresh to clear any remaining state
    window.location.reload();
  };

  // Display username or "Admin" if no data
  const username = data?.firstName || 'Admin';

  return (
    <div className='flex items-end justify-between'>
      <h1 className='text-2xl font-medium'>Hello <br /> 
        <span className='text-3xl font-semibold'>{username} 👋</span>
      </h1>
      <button 
        onClick={logOutUser}
        className='bg-red-600 text-base font-medium text-white px-5 py-2 rounded-sm hover:bg-red-700 transition-colors'
      >
        Log Out
      </button>
    </div>
  );
};

export default Header;