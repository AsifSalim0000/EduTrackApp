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

export {getCoursesByUser}