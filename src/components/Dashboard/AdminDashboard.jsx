import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import EmployeeDashboard from './EmployeeDashboard';
import AllTask from '../other/AllTask';
import CreateTask from '../other/CreateTask'; // Import CreateTask
import Header from '../other/Header';

const AdminDashboard = ({ changeUser  }) => {
  const [userData] = useContext(AuthContext);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleBackToAdmin = () => {
    setSelectedEmployee(null);
  };

  return (
    <div className='h-screen w-full p-7'>
      <Header changeUser ={changeUser } />
      
      {selectedEmployee ? (
        <div>
          <button 
            onClick={handleBackToAdmin}
            className='mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700'
          >
            ← Back to Admin View
          </button>
          <EmployeeDashboard 
            data={selectedEmployee} 
            isAdminView={true}
          />
        </div>
      ) : (
        <>
          <CreateTask /> {/* CreateTask component at the top */}
          <AllTask /> {/* AllTask component below CreateTask */}
          
          <div className='mb-8'>
            <h2 className='text-2xl font-bold text-white'>Employee List</h2>
            <div className='mt-4 space-y-2'>
              {userData.map(employee => (
                <div
                  key={employee.id}
                  onClick={() => handleEmployeeSelect(employee)}
                  className='p-3 cursor-pointer bg-white/5 rounded hover:bg-white/10 transition-colors'
                >
                  <h3 className='text-white'>{employee.firstName}</h3>
                  <p className='text-gray-400 text-sm'>{employee.email}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;