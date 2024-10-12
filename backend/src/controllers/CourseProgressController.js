import { getUserCourseProgress, markContentAsComplete } from '../usecases/CourseProgressUsecase.js';

const markAsComplete = async (req, res) => {
  try {
    const { courseId, contentId } = req.body;
    const userId= req.user._id

    const progress = await markContentAsComplete(userId, courseId, contentId);

    res.status(200).json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const handleGetUserCourseProgress = async (req, res) => {
    try {
      const userId = req.user._id;
      const courseProgress = await getUserCourseProgress(userId);
  
      return res.status(200).json(courseProgress);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching course progress', error });
    }
  };
export {markAsComplete,handleGetUserCourseProgress}