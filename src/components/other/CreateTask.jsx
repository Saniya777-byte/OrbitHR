import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthProvider';

const CreateTask = () => {
    const [userData, setUserData] = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errors, setErrors] = useState({});
    
    // Form state
    const [formData, setFormData] = useState({
        taskTitle: '',
        taskDescription: '',
        taskDate: '',
        asignTo: '',
        category: 'design', // default category
        priority: 'medium'
    });

    // Predefined categories
    const categories = ['design', 'development', 'marketing', 'content', 'research'];
    const priorities = [
        { value: 'low', label: 'Low', color: 'text-green-400' },
        { value: 'medium', label: 'Medium', color: 'text-yellow-400' },
        { value: 'high', label: 'High', color: 'text-red-400' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.taskTitle) newErrors.taskTitle = 'Title is required';
        if (!formData.asignTo) newErrors.asignTo = 'Please select an employee';
        if (!formData.taskDate) newErrors.taskDate = 'Date is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsLoading(true);
        
        try {
            // Generate a unique ID for the task
            const newTaskId = Date.now().toString();
            
            const newTask = {
                id: newTaskId,
                ...formData,
                status: 'new',
                createdAt: new Date().toISOString(),
                active: false,
                newTask: true,
                completed: false,
                failed: false
            };

            // Corrected taskCounts update
            const updatedData = userData.map(employee => {
                if (employee.firstName === formData.asignTo) {
                    // Ensure taskCounts exists and has proper default values
                    const safeTaskCounts = employee.taskCounts || {
                        newTask: 0,
                        active: 0,
                        completed: 0,
                        failed: 0
                    };
                    
                    return {
                        ...employee,
                        tasks: [...(employee.tasks || []), newTask],
                        taskCounts: {
                            ...safeTaskCounts,
                            // Ensure we're adding to a non-null value
                            newTask: (safeTaskCounts.newTask || 0) + 1
                        }
                    };
                }
                return employee;
            });

            setUserData(updatedData);
            setShowSuccess(true);
            
            setFormData({
                taskTitle: '',
                taskDescription: '',
                taskDate: '',
                asignTo: '',
                category: 'design',
                priority: 'medium'
            });

            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error('Error creating task:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='p-5 bg-[#1c1c1c] mt-5 rounded'>
            {showSuccess && (
                <div className="mb-4 p-3 bg-green-600 text-white rounded">
                    Task created successfully!
                </div>
            )}
            
            <form onSubmit={submitHandler} className='flex flex-wrap w-full items-start justify-between'>
                <div className='w-1/2'>
                    <div>
                        <h3 className='text-sm text-gray-300 mb-0.5'>Task Title</h3>
                        <input
                            name="taskTitle"
                            value={formData.taskTitle}
                            onChange={handleChange}
                            className={`text-sm py-1 px-2 w-4/5 rounded outline-none bg-transparent border-[1px] ${errors.taskTitle ? 'border-red-500' : 'border-gray-400'} mb-1`}
                            type="text"
                            placeholder='Make a UI design'
                        />
                        {errors.taskTitle && <p className="text-red-500 text-xs mb-3">{errors.taskTitle}</p>}
                    </div>
                    
                    <div>
                        <h3 className='text-sm text-gray-300 mb-0.5'>Date</h3>
                        <input
                            name="taskDate"
                            value={formData.taskDate}
                            onChange={handleChange}
                            className={`text-sm py-1 px-2 w-4/5 rounded outline-none bg-transparent border-[1px] ${errors.taskDate ? 'border-red-500' : 'border-gray-400'} mb-1`}
                            type="date"
                        />
                        {errors.taskDate && <p className="text-red-500 text-xs mb-3">{errors.taskDate}</p>}
                    </div>
                    
                    <div>
                        <h3 className='text-sm text-gray-300 mb-0.5'>Assign to</h3>
                        <select
                            name="asignTo"
                            value={formData.asignTo}
                            onChange={handleChange}
                            className={`text-sm py-1 px-2 w-4/5 rounded outline-none bg-transparent border-[1px] ${errors.asignTo ? 'border-red-500' : 'border-gray-400'} mb-1`}
                        >
                            <option value="">Select Employee</option>
                            {userData.map(employee => (
                                <option key={employee.id} value={employee.firstName}>
                                    {employee.firstName}
                                </option>
                            ))}
                        </select>
                        {errors.asignTo && <p className="text-red-500 text-xs mb-3">{errors.asignTo}</p>}
                    </div>
                    
                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <h3 className='text-sm text-gray-300 mb-0.5'>Category</h3>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className='text-sm py-1 px-2 w-full rounded outline-none bg-transparent border-[1px] border-gray-400 mb-4'
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>
                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="w-1/2">
                            <h3 className='text-sm text-gray-300 mb-0.5'>Priority</h3>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className='text-sm py-1 px-2 w-full rounded outline-none bg-transparent border-[1px] border-gray-400 mb-4'
                            >
                                {priorities.map(priority => (
                                    <option 
                                        key={priority.value} 
                                        value={priority.value}
                                        className={priority.color}
                                    >
                                        {priority.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className='w-2/5 flex flex-col items-start'>
                    <h3 className='text-sm text-gray-300 mb-0.5'>Description</h3>
                    <textarea
                        name="taskDescription"
                        value={formData.taskDescription}
                        onChange={handleChange}
                        className='w-full h-44 text-sm py-2 px-4 rounded outline-none bg-transparent border-[1px] border-gray-400'
                        placeholder='Describe the task in detail...'
                    />
                    <button 
                        type="submit"
                        disabled={isLoading}
                        className={`flex items-center justify-center gap-2 bg-emerald-500 py-3 hover:bg-emerald-600 px-5 rounded text-sm mt-4 w-full ${isLoading ? 'opacity-70' : ''}`}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating...
                            </>
                        ) : 'Create Task'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateTask;