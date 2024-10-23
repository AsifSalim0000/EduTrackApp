// components/ReportPage.js
import React, { useEffect, useState } from 'react';
import { useDownloadEarningsReportMutation, useDownloadStudentPerformanceReportMutation } from '../../store/instructorApiSlice';


const ReportPage = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [downloadEarningsReport] = useDownloadEarningsReportMutation();
  const [downloadStudentPerformanceReport] = useDownloadStudentPerformanceReportMutation();

  // Initialize jQuery datepicker
  useEffect(() => {
    // Ensure DOM elements exist before jQuery is used
    $("#fromDate").datepicker({
      dateFormat: "yy-mm-dd",
      maxDate: new Date(), // Disallow future dates
      onSelect: function (selectedDate) {
        setFromDate(selectedDate);
      },
    });

    $("#toDate").datepicker({
      dateFormat: "yy-mm-dd",
      minDate: new Date(), // Start today or after today
      onSelect: function (selectedDate) {
        setToDate(selectedDate);
      },
    });
  }, []);

  const handleDownloadEarningsReport = async () => {
    try {
      const response = await downloadEarningsReport({ fromDate, toDate }).unwrap();
      
      // Check if response is a Blob
      if (response instanceof Blob) {
        const url = window.URL.createObjectURL(response);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `earnings_report_${fromDate}_to_${toDate}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error('Unexpected response:', response);
      }
    } catch (error) {
      console.error('Error downloading earnings report:', error);
    }
};


  const handleDownloadStudentPerformanceReport = async () => {
    try {
      const response = await downloadStudentPerformanceReport({ fromDate, toDate }).unwrap();
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `student_performance_report_${fromDate}_to_${toDate}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading student performance report:', error);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Generate Reports</h2>
      <div className="card p-4 shadow-sm">
        <div className="form-group row mb-3">
          <label htmlFor="fromDate" className="col-sm-2 col-form-label">From Date:</label>
          <div className="col-sm-10">
            <input type="text" id="fromDate" className="form-control" value={fromDate} readOnly />
          </div>
        </div>
        <div className="form-group row mb-4">
          <label htmlFor="toDate" className="col-sm-2 col-form-label">To Date:</label>
          <div className="col-sm-10">
            <input type="text" id="toDate" className="form-control" value={toDate} readOnly />
          </div>
        </div>
        <div className="d-flex justify-content-between">
          <button className="btn btn-primary" onClick={handleDownloadEarningsReport}>
            Download Earnings Report
          </button>
          <button className="btn btn-success" onClick={handleDownloadStudentPerformanceReport}>
            Download Student Performance Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
