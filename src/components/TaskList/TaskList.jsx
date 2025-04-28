import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import TaskCard from './TaskCard';

const TaskList = () => {
  const [userData] = useContext(AuthContext);
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  const employee = userData.find(emp => emp.email === loggedInUser?.data?.email);

  if (!employee) return <div>Loading...</div>;

  return (
    <div className='h-[50%] overflow-x-auto flex items-center justify-start gap-5 flex-nowrap w-full py-1 mt-16'>
      {employee.tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;