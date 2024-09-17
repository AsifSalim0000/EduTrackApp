import courseUsecase from '../usecases/courseUsecase.js'

const getCoursesByUser = async (req, res) => {
    try {
      const userId  = req.user.id;
      const { page = 1, limit = 6, search = '' } = req.query;
      const result = await courseUsecase.getMyCourses({ userId, page, limit, search });
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
const getMyCourseById= async(req,res)=>{
  const { courseId } = req.params;
    const userId = req.user._id; 

    try {
        
        const course = await courseUsecase.getMyCourseByIdUseCase(userId, courseId);
        
        return res.status(200).json(
          course
        );
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

export {getCoursesByUser,getMyCourseById}