import asyncHandler from 'express-async-handler';
import { createInstructor } from '../../repositories/InstructorRepository.js';
import { getDashboardInfo } from '../../usecases/DashboardInfo.js';

const handleCreateInstructor = asyncHandler(async (req, res) => {
  const instructorData = req.body;
  const userId = req.user._id;
  console.log('userId received:', userId);
  const newInstructor = await createInstructor(instructorData, userId);
  res.status(201).json(newInstructor);
});

 const getInstructorDashboardInfo = async (req, res) => {
  try {
    const instructorId = req.user._id; 
    
    const dashboardInfo = await getDashboardInfo(instructorId);
    return res.status(200).json(dashboardInfo);
  } catch (error) {
    console.error('Error fetching dashboard info:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};
export { handleCreateInstructor, getInstructorDashboardInfo };
