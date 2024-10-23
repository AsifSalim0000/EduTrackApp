import Order from '../../domain/Order.js';
import Course from '../../domain/Course.js';
import { chromium } from 'playwright'; // Import Playwright
import CourseProgress from '../../domain/CourseProgress.js';

const getEarningsReport = async (req, res) => {
    const { fromDate, toDate } = req.body;
    const instructorId = req.user._id;

    try {
        // Fetch the instructor's courses
        const instructorCourses = await Course.find({ instructor: instructorId }).select('_id title');
        const courseIds = instructorCourses.map(course => course._id);

      
        const orders = await Order.find({
            'items.courseId': { $in: courseIds },
            createdAt: { $gte: new Date(fromDate), $lte: new Date(toDate) },
            status: 'Completed',
        }).populate('items.courseId userId'); 

        const totalEarnings = orders.reduce((sum, order) => sum + order.amount, 0);

        const reportContent = `
        <html>
          <head>
            <title>Earnings Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #333; }
              p { font-size: 16px; }
              .total-earnings { font-weight: bold; font-size: 20px; color: green; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h1>Earnings Report</h1>
            <p class="total-earnings">Total Earnings: $${totalEarnings.toFixed(2)}</p>
            <h2>Order Details</h2>
            <table>
              <tr>
                <th>Student Name</th>
                <th>Course Title</th>
                <th>Purchase Date</th>
                <th>Amount</th>
              </tr>
              ${orders.map(order => `
                ${order.items.map(item => `
                  <tr>
                    <td>${order.userId.username}</td>
                    <td>${item.courseId.title}</td>
                    <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>$${item.price.toFixed(2)}</td>
                  </tr>
                `).join('')}
              `).join('')}
            </table>
          </body>
        </html>`;

        // Launch Playwright browser
        const browser = await chromium.launch({
            headless: true,
        });
        const page = await browser.newPage();

        await page.setContent(reportContent);
        const pdf = await page.pdf({ format: 'A4' }); // Capture PDF output here
        await browser.close();

        res.contentType('application/pdf');
        res.send(pdf); // Send the captured PDF
    } catch (error) {
        console.error('Error in getEarningsReport:', error);
        res.status(500).json({ message: error.message });
    }
};

const getStudentPerformanceReport = async (req, res) => {
    const { fromDate, toDate } = req.body;
    const instructorId = req.user._id;

    try {
        const instructorCourses = await Course.find({ instructor: instructorId }).select('_id');
        const courseIds = instructorCourses.map(course => course._id);

        const courseProgress = await CourseProgress.find({
            courseId: { $in: courseIds },
            updatedAt: { $gte: new Date(fromDate), $lte: new Date(toDate) },
        }).populate('userId courseId');

        
        const browser = await chromium.launch({
            headless: true,
            // You can add other options here if needed
        });
        const page = await browser.newPage();

        const reportContent = `
        <html>
          <head>
            <title>Student Performance Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #333; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h1>Student Performance Report</h1>
            <table>
              <tr>
                <th>Student Name</th>
                <th>Course Title</th>
                <th>Progress</th>
                <th>Last Updated</th>
              </tr>
              ${courseProgress.map(progress => `
                <tr>
                  <td>${progress.userId.username}</td>
                  <td>${progress.courseId.title}</td>
                  <td>${Math.floor(progress.progress)}%</td>
                  <td>${new Date(progress.updatedAt).toLocaleDateString()}</td>
                </tr>`).join('')}
            </table>
          </body>
        </html>`;

        await page.setContent(reportContent);
        const pdf = await page.pdf({ format: 'A4' }); // Capture PDF output here
        await browser.close();

        res.contentType('application/pdf');
        res.send(pdf); // Send the captured PDF
    } catch (error) {
        console.error('Error in getStudentPerformanceReport:', error);
        res.status(500).json({ message: error.message });
    }
};

export { getEarningsReport, getStudentPerformanceReport };
