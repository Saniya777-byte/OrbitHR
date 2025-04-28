import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthProvider';

const TaskCard = ({ task }) => {
  const [userData, setUserData] = useContext(AuthContext);

  const updateTaskStatus = (newStatus) => {
    const updatedData = userData.map(employee => {
      // Find the employee who owns this task
      const employeeHasTask = employee.tasks.some(t => t.id === task.id);
      if (!employeeHasTask) return employee;

      // Update the task
      const updatedTasks = employee.tasks.map(t => {
        if (t.id === task.id) {
          return {
            ...t,
            active: newStatus === 'active',
            newTask: newStatus === 'new',
            completed: newStatus === 'completed',
            failed: newStatus === 'failed'
          };
        }
        return t;
      });

      // Update task counts
      const counts = { ...employee.taskCounts };
      
      // Decrement previous status
      if (task.active) counts.active--;
      if (task.newTask){
        if (counts.newTask>0){
          counts.newTask--;
        }
      }
      if (task.completed) counts.completed--;
      if (task.failed) counts.failed--;

      // Increment new status
      counts[newStatus]++;

      return {
        ...employee,
        tasks: updatedTasks,
        taskCounts: counts
      };
    });

    setUserData(updatedData);
  };

  return (
    <div className={`flex-shrink-0 h-full w-[300px] p-5 rounded-xl ${
      task.newTask ? 'bg-green-400' : 
      task.active ? 'bg-blue-400' : 
      task.completed ? 'bg-emerald-600' : 
      'bg-red-500'
    }`}>
      <div className='flex justify-between items-center'>
        <h3 className='bg-gray-800 text-sm px-3 py-1 rounded text-white'>{task.category}</h3>
        <h4 className='text-sm'>{task.taskDate}</h4>
      </div>
      <h2 className='mt-5 text-2xl font-semibold'>{task.taskTitle}</h2>
      <p className='text-sm mt-2'>{task.taskDescription}</p>

      <div className='flex justify-between mt-6'>
        {task.newTask && (
          <button
            onClick={() => updateTaskStatus('active')}
            className='bg-blue-500 hover:bg-blue-600 text-white rounded font-medium py-1 px-2 text-xs'
          >
            Accept Task
          </button>
        )}

        {task.active && (
          <>
            <button
              onClick={() => updateTaskStatus('completed')}
              className='bg-green-500 hover:bg-green-600 text-white rounded font-medium py-1 px-2 text-xs'
            >
              Mark as Completed
            </button>
            <button
              onClick={() => updateTaskStatus('failed')}
              className='bg-red-500 hover:bg-red-600 text-white rounded font-medium py-1 px-2 text-xs'
            >
              Mark as Failed
            </button>
          </>
        )}

        {(task.completed || task.failed) && (
          <span className='text-xs py-1 px-2 bg-white bg-opacity-20 rounded'>
            {task.completed ? 'Completed' : 'Failed'}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
