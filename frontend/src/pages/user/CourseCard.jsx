import React from 'react';

function CourseCard({ title, description, progress, thumbnail, onClick }) {
  return (
    <div className="card h-100 my-4 shadow-sm overflow-hidden">
      <img src={`${thumbnail}`} className="card-img-top" alt={title} />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p
         className="card-text"
         style={{
         overflow: 'hidden',
         textOverflow: 'ellipsis',
         display: '-webkit-box',
          WebkitLineClamp: 3, 
          WebkitBoxOrient: 'vertical', 
              }}
            >
  {description}
</p>

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
        <button className="btn btn-primary mt-3" onClick={onClick}>
          Watch Lecture
        </button>
      </div>
    </div>
  );
}

export default CourseCard;
