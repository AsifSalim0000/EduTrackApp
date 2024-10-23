import Course from '../domain/Course.js';
import courseUsecase from '../usecases/courseUsecase.js'
import { HttpStatus } from '../utils/HttpStatus.js';

const getCoursesByUser = async (req, res) => {
    try {
      const userId  = req.user.id;
      const { page = 1, limit = 6, search = '' } = req.query;
      const result = await courseUsecase.getMyCourses({ userId, page, limit, search });
      res.json(result);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  };
const getMyCourseById= async(req,res)=>{
  const { courseId } = req.params;
    const userId = req.user._id; 

    try {
        
        const course = await courseUsecase.getMyCourseByIdUseCase(userId, courseId);
        
        return res.status(HttpStatus.OK).json(
          course
        );
    } catch (error) {
        return res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: error.message
        });
    }
}
const searchCourses = async (req, res) => {
  const { query } = req.body; // Get the search query from the request body

  try {
    const courses = await courseUsecase.searchCoursesUseCase(query); // Call the use case
    res.json(courses); // Send back the search results
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchFilterCourses = async (req, res) => {
  const { query, filters } = req.body;

  try {
    const courses = await courseUsecase.searchFilterCoursesUseCase(query, filters); // Call the use case
    res.json(courses); // Send courses back to the frontend
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export {getCoursesByUser,getMyCourseById,searchCourses,searchFilterCourses}