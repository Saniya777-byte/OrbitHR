import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import TaskCard from '../TaskList/TaskCard';
import Header from '../other/Header';
import TaskListNumbers from '../other/TaskListNumbers';

const EmployeeDashboard = ({ data, isAdminView, changeUser }) => {
  const [userData] = useContext(AuthContext);
  
  // Get employee data either from props (admin view) or logged in user
  const employee = isAdminView ? data : userData.find(emp => 
    emp.email === JSON.parse(localStorage.getItem('loggedInUser'))?.data?.email
  );

  if (!employee) {
    return (
      <div className="p-10 bg-[#1C1C1C] h-screen flex items-center justify-center">
        <div className="text-white">Employee data not found</div>
      </div>
    );
  }

  const visibleTasks = (employee.tasks || []).filter(task => 
    (task.newTask || task.active) && 
    !task.completed && 
    !task.failed
  );

  return (
    <div className='p-10 bg-[#1C1C1C] h-screen'>
      {!isAdminView && <Header changeUser={changeUser} data={data} />}
      <TaskListNumbers data={employee} />
      
      <div className='h-[50%] overflow-x-auto flex items-start gap-5 pb-4 mt-16'>
        {visibleTasks.length > 0 ? (
          visibleTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onTaskUpdate={() => {
                // Optional: Add admin-specific handling
              }}
            />
          ))
        ) : (
          <div className="text-white w-full text-center mt-10">
            No tasks available
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;

