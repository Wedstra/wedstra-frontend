// ReviewCarousel.jsx
import React, { useEffect, useState } from "react";
import "./reviews.css";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import axiosInstance from "../../API/axiosInstance";

/* ---------------- helpers ---------------- */
const renderStars = (value) => {
  const full = Math.floor(value);        // whole stars
  const half = value % 1 >= 0.25 && value % 1 < 0.75; // show half if 0.25-0.74
  const total = half ? full + 1 : full;   // slots consumed so far

  return [
    ...[...Array(full)].map((_, i) => <FaStar key={i} color="#ffa41c" />),
    ...(half ? [<FaStarHalfAlt key="half" color="#ffa41c" />] : []),
    ...[...Array(5 - total)].map((_, i) => (
      <FaRegStar key={`empty-${i}`} color="#ccc" />
    )),
  ];
};

const chunk = (arr, size) =>
  arr.reduce((acc, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]), []);

/* -------------- one card ----------------- */
const ReviewCard = ({ r }) => (
  <div className="review-box">
    <div className="review-header">
      <div className="avatar-circle">{r.username?.charAt(0).toUpperCase() || "U"}</div>
      <strong>{r.username}</strong>
    </div>

    <div className="review-rating">
      {renderStars(r.rating)} <br />
      <strong className="review-title">{r.title}</strong>
    </div>

    {/* show max 3 lines – CSS line-clamp rule already added earlier */}
    <p className="review-body">{r.content}</p>
  </div>
);

/* -------------- carousel ----------------- */
const ReviewCarousel = () => {
  const [reviews, setReviews] = useState([]);
  const cardsPerSlide = 3;

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosInstance.get("/reviews/website");
        setReviews(data || []);

      } catch (err) {
        console.error("Failed to fetch reviews", err);
      }
    })();
  }, []);

  /* ---------- derived stats for summary block ----------------------- */
  const ratingCounts = [5, 4, 3, 2, 1].map(
    (s) => reviews.filter((r) => r.rating === s).length
  );
  const maxCount = Math.max(...ratingCounts, 1);
  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);

  const slides = chunk(reviews, cardsPerSlide);


  return (

    <div>
      <section id="summary-reviews" className=" container my-3">
        <div className="overall">
          <h6>Overall</h6>
          <div className="score">{avgRating.toFixed(1)}</div>
          <div className="stars">
            {renderStars(avgRating)}
          </div>
        </div>

        <div className="histogram">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingCounts[5 - star];
            const pct = (count / maxCount) * 100;
            return (
              <div key={star} id="histogram-row">
                <span className="label">{star}</span>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <h3 className="container p-0" style={{ marginBottom: "-20px" }}>Reviews  <span className="text-muted" style={{ fontSize: "20px", fontWeight:800 }}>{`(${reviews.length})`}</span></h3>
      <div id="reviewCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {slides.map((group, slideIdx) => (
            <div className={`carousel-item ${slideIdx === 0 ? "active" : ""}`} key={slideIdx}>
              <div className="container">
                <div className="row g-3" id="cards-row">
                  {group.map((r, cardIdx) => (
                    <div id="card-col" className="col-12 col-md-6 col-lg-4" key={cardIdx}>
                      <ReviewCard r={r} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* controls (keep or remove) */}
        <button className="carousel-control-prev" type="button" data-bs-target="#reviewCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" />
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#reviewCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" />
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
};

export default ReviewCarousel;

// import React from 'react';
// import './reviews.css'
// import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

// const reviews = [
//   {
//     name: 'Grace Clayton',
//     rating: 5,
//     comment: 'Excellent service!',
//     avatar: 'https://via.placeholder.com/40',
//   },
//   {
//     name: 'Adam Chandler',
//     rating: 4,
//     comment: 'Very good experience overall.',
//     avatar: 'https://via.placeholder.com/40',
//   },
//   {
//     name: 'Libby Sidney',
//     rating: 3,
//     comment: 'It was okay, not the best.',
//     avatar: 'https://via.placeholder.com/40',
//   },
//   {
//     name: 'Regene Debra',
//     rating: 4,
//     comment: 'Loved it, will return!',
//     avatar: 'https://via.placeholder.com/40',
//   },
//   {
//     name: 'Paulo Denise',
//     rating: 5,
//     comment: 'Exceptional support.',
//     avatar: 'https://via.placeholder.com/40',
//   },
//   {
//     name: 'Hunter Amery',
//     rating: 2,
//     comment: 'Not satisfied with the product.',
//     avatar: 'https://via.placeholder.com/40',
//   },
// ];

// const getAvgRating = () => {
//   const total = reviews.reduce((sum, r) => sum + r.rating, 0);
//   return (total / reviews.length).toFixed(1);
// };

// const renderStars = (rating) => {
//   const full = Math.floor(rating);
//   const half = rating - full >= 0.5;
//   const stars = [];

//   for (let i = 0; i < 5; i++) {
//     if (i < full) stars.push(<FaStar key={i} color="#ffc107" />);
//     else if (i === full && half) stars.push(<FaStarHalfAlt key={i} color="#ffc107" />);
//     else stars.push(<FaRegStar key={i} color="#e4e5e9" />);
//   }

//   return <span className="stars">{stars}</span>;
// };

// const getRatingCounts = () => {
//   const counts = [0, 0, 0, 0, 0];
//   reviews.forEach((r) => counts[r.rating - 1]++);
//   return counts.reverse(); // 5 to 1
// };

// const ReviewSection = () => {
//   const avgRating = getAvgRating();
//   const ratingCounts = getRatingCounts();
//   const maxCount = Math.max(...ratingCounts);

//   return (
//     <div className="amazon-review-container">
//       {reviews.map((r, i) => (
//         <div className="review-box" key={i}>
//           <div className="review-header">
//             <div className="avatar-circle">{r.name.charAt(0).toUpperCase()}</div>
//             <strong>{r.name}</strong>
//           </div>
//           <div className="review-rating">
//             {renderStars(r.rating)}
//             <strong className="review-title"> {r.title}</strong>
//           </div>
//           <div className="review-meta">
//             Reviewed in India on Wedstra
//             <br />
//             Colour:
//           </div>
//           <p className="review-body">{r.review}</p>
//           {r.image && (
//             <img src={r.image} alt="review-img" className="review-image" />
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

//  export default ReviewSection;



// import React, { useState } from 'react';
// import { FaStar } from 'react-icons/fa';

// const StarReview = ({ onRatingChange }) => {
//     const [rating, setRating] = useState(0);
//     const [hover, setHover] = useState(null);

//     const handleClick = (rate) => {
//         setRating(rate);
//         onRatingChange(rate); // Store rating in parent or variable
//     };

//     return (
//         <div className="star-review">
//             <h3>Rate your experience:</h3>
//             <div className="stars">
//                 {[...Array(5)].map((_, index) => {
//                     const ratingValue = index + 1;
//                     return (
//                         <label key={ratingValue}>
//                             <input
//                                 type="radio"
//                                 name="rating"
//                                 value={ratingValue}
//                                 onClick={() => handleClick(ratingValue)}
//                             />
//                             <FaStar
//                                 className="star"
//                                 color={
//                                     ratingValue <= (hover || rating)
//                                         ? '#ffc107'
//                                         : '#e4e5e9'
//                                 }
//                                 size={32}
//                                 onMouseEnter={() => setHover(ratingValue)}
//                                 onMouseLeave={() => setHover(null)}
//                             />
//                         </label>
//                     );
//                 })}
//             </div>
//             <p>Selected Rating: {rating}</p>
//         </div>
//     );
// };

// export default StarReview;

