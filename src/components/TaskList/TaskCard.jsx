import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthProvider';

const TaskCard = ({ task, onTaskUpdate }) => {
  const [userData, setUserData] = useContext(AuthContext);
  const [taskStatus, setTaskStatus] = useState(task.newTask ? 'new' : 
                                              task.active ? 'active' : 
                                              task.completed ? 'completed' : 'failed');
  const [isVisible, setIsVisible] = useState(true);

  const handleStatusChange = (newStatus) => {
    // Update local state immediately for responsive UI
    setTaskStatus(newStatus);
    
    // If marking as completed or failed, hide the card after a delay
    if (newStatus === 'completed' || newStatus === 'failed') {
      setTimeout(() => setIsVisible(false), 300); // Animation duration
    }

    // Update the global state
    const updatedData = userData.map(employee => {
      if (!employee.tasks.some(t => t.id === task.id)) return employee;

      const updatedTasks = employee.tasks.map(t => {
        if (t.id === task.id) {
          return {
            ...t,
            newTask: newStatus === 'new',
            active: newStatus === 'active',
            completed: newStatus === 'completed',
            failed: newStatus === 'failed'
          };
        }
        return t;
      });

      // Update task counts safely
      const counts = { ...employee.taskCounts };

      // Decrease count based on previous taskStatus
      if (taskStatus === 'new') counts.newTask--;
      if (taskStatus === 'active') counts.active--;
      if (taskStatus === 'completed') counts.completed--;
      if (taskStatus === 'failed') counts.failed--;

      // Increase count based on newStatus
      counts[newStatus]++;

      return {
        ...employee,
        tasks: updatedTasks,
        taskCounts: counts
      };
    });

    setUserData(updatedData);

    // Notify parent component if needed
    if (onTaskUpdate) {
      onTaskUpdate(task.id, newStatus);
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`flex-shrink-0 h-full w-[300px] p-5 rounded-xl transition-all duration-300 ${
      taskStatus === 'new' ? 'bg-green-400' : 
      taskStatus === 'active' ? 'bg-blue-400' : 
      'opacity-0 h-0 p-0 overflow-hidden' // For smooth exit animation
    }`}>
      <div className='flex justify-between items-center'>
        <h3 className='bg-gray-800 text-sm px-3 py-1 rounded text-white'>
          {task.category}
        </h3>
        <h4 className='text-sm'>{task.taskDate}</h4>
      </div>
      <h2 className='mt-5 text-2xl font-semibold'>{task.taskTitle}</h2>
      <p className='text-sm mt-2'>{task.taskDescription}</p>

      <div className='flex justify-between mt-6'>
        {taskStatus === 'new' && (
          <button
            onClick={() => handleStatusChange('active')}
            className='bg-blue-500 hover:bg-blue-600 text-white rounded font-medium py-2 px-4 text-sm transition-colors w-full'
          >
            Accept Task
          </button>
        )}

        {taskStatus === 'active' && (
          <>
            <button
              onClick={() => handleStatusChange('completed')}
              className='bg-green-500 hover:bg-green-600 text-white rounded font-medium py-2 px-4 text-sm transition-colors flex-1 mr-2'
            >
              Completed
            </button>
            <button
              onClick={() => handleStatusChange('failed')}
              className='bg-red-500 hover:bg-red-600 text-white rounded font-medium py-2 px-4 text-sm transition-colors flex-1'
            >
              Failed
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
