import React from 'react';

function CourseCard({ title, description, progress, thumbnail, onClick }) {
  return (
    <div className="card mb-4 shadow-sm">
      <img src={`/src/assets/uploads/${thumbnail}`} className="card-img-top" alt={title} />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{description}</p>
        <div className="progress">
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {progress}%
          </div>
        </div>
        <button className="btn btn-primary" onClick={onClick}>
          Watch Lecture
        </button>
      </div>
    </div>
  );
}

export default CourseCard;
