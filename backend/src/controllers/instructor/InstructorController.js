import asyncHandler from 'express-async-handler';
import { createInstructor } from '../../repositories/InstructorRepository.js';

const handleCreateInstructor = asyncHandler(async (req, res) => {
  const instructorData = req.body;
  const token = req.cookies.jwt;
  console.log('Token received:', token);
  const newInstructor = await createInstructor(instructorData, token);
  res.status(201).json(newInstructor);
});

export { handleCreateInstructor };
