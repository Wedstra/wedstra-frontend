import React from 'react';
import './reviews.css';
import StateCityDropdown from '../selectCity/SelectCity';

const reviewSummary = {
  overall: 4.0,
  categories: [
    { name: 'Cleanliness', score: 4.0 },
    { name: 'Safety & Security', score: 4.0 },
    { name: 'Staff', score: 3.5 },
    { name: 'Amenities', score: 3.5 },
    { name: 'Location', score: 3.0 },
  ],
};

const reviews = [
  {
    user: 'Alexander Riley',
    rating: 4.0,
    comment:
      'Easy booking, great value! Cosy rooms at a reasonable price in Sheffield’s vibrant center. Surprisingly quiet too. Highly recommended!',
    images: ['/img1.jpg', '/img2.jpg', '/img3.jpg'],
  },
  {
    user: 'Emma Creight',
    rating: 4.0,
    comment:
      'Effortless booking, unbeatable affordability! Smart yet comfortable spaces in the heart of Sheffield’s nightlife hub. Surrounded by elegant housing. It’s a peaceful gem. Thumbs up!',
    images: ['/img4.jpg', '/img5.jpg', '/img6.jpg'],
  },
];

const Reviews = () => {
  return (
    <div className="reviews-container">
      <StateCityDropdown/>
      <div className="summary-section">
        <h3>Reviews</h3>
        <div className="overall-rating">
          <div className="rating-number">{reviewSummary.overall.toFixed(1)}</div>
          <div className="stars">★★★★☆</div>
          <p>128 ratings</p>
        </div>

        <div className="category-ratings">
          {reviewSummary.categories.map((cat, idx) => (
            <div className="category-row" key={idx}>
              <span>{cat.name}</span>
              <div className="bar-container">
                <div className="bar-fill" style={{ width: `${(cat.score / 5) * 100}%` }}></div>
              </div>
              <span className="cat-score">{cat.score.toFixed(1)}</span>
            </div>
          ))}
        </div>

        <div className="tags">
          {reviewSummary.categories.map((cat, idx) => (
            <span className="tag" key={idx}>
              {cat.score.toFixed(1)} {cat.name}
            </span>
          ))}
        </div>
      </div>

      <div className="user-reviews">
        {reviews.map((rev, idx) => (
          <div className="review-card" key={idx}>
            <div className="review-header">
              <strong>{rev.user}</strong>
              <span className="stars">★★★★☆</span>
            </div>
            <p>{rev.comment}</p>
            <div className="review-images">
              {rev.images.map((img, i) => (
                <img key={i} src={img} alt="review" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
