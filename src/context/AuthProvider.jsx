import React, { createContext, useEffect, useState } from 'react';
import { getLocalStorage, setLocalStorage } from '../utils/localStorage';

export const AuthContext = createContext();

// Helper function to recalculate counts based on tasks
const calculateTaskCounts = (tasks) => {
  const counts = {
    newTask: 0,
    active: 0,
    completed: 0,
    failed: 0
  };
  
  if (!tasks || !Array.isArray(tasks)) return counts;
  
  tasks.forEach(task => {
    if (task.newTask) counts.newTask++;
    if (task.active) counts.active++;
    if (task.completed) counts.completed++;
    if (task.failed) counts.failed++;
  });
  
  return counts;
};

const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState([]);

    // Load initial data
    useEffect(() => {
        const { employees } = getLocalStorage();
        
        // Fix task counts when loading data
        const fixedEmployees = employees?.map(employee => {
            // Calculate correct counts based on tasks
            const correctCounts = calculateTaskCounts(employee.tasks);
            
            return {
                ...employee,
                taskCounts: correctCounts
            };
        }) || [];
        
        setUserData(fixedEmployees);
    }, []);
    
    // Persist changes
    useEffect(() => {
        if (userData.length > 0) {
            setLocalStorage(userData);
        }
    }, [userData]);

    // Custom setter that ensures counts are always correct
    const setUserDataWithFixedCounts = (newUserData) => {
        // If the new data is a function, apply it to current state and fix counts
        if (typeof newUserData === 'function') {
            setUserData(prevData => {
                const updatedData = newUserData(prevData);
                
                // Recalculate all task counts to ensure consistency
                return updatedData.map(employee => ({
                    ...employee,
                    taskCounts: calculateTaskCounts(employee.tasks)
                }));
            });
        } else {
            // If it's a direct value, fix counts and set
            const fixedData = newUserData.map(employee => ({
                ...employee,
                taskCounts: calculateTaskCounts(employee.tasks)
            }));
            
            setUserData(fixedData);
        }
    };

    return (
        <AuthContext.Provider value={[userData, setUserDataWithFixedCounts]}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;