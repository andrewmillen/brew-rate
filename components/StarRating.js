"use client";

import { StarIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

function StarRating({ rating, onChange, readOnly = false }) {
  const [hoverRating, setHoverRating] = useState(0);
  const totalStars = 5;

  const handleKeyDown = (e) => {
    if (readOnly) return;

    switch (e.key) {
      case "ArrowRight":
        onChange(Math.min(rating + 1, 5));
        break;
      case "ArrowLeft":
        onChange(Math.max(rating - 1, 1));
        break;
      default:
        return;
    }
    e.preventDefault();
  };

  const renderStar = (index) => {
    const value = hoverRating || rating;
    const filled = value > index;

    return (
      <div
        key={index}
        className="relative inline-block w-7 h-7 cursor-pointer"
        onMouseEnter={() => !readOnly && setHoverRating(index + 1)}
        onClick={() => !readOnly && onChange(index + 1)}
      >
        <StarIcon className="absolute w-7 h-7 text-gray-200" />
        {filled && <StarIcon className="absolute w-7 h-7 text-amber-400" />}
      </div>
    );
  };

  const renderReadOnlyStars = () => {
    return [...Array(rating || 0)].map((_, index) => (
      <StarIcon key={index} className="w-5 h-5 text-amber-400" />
    ));
  };

  if (readOnly) {
    return <div className="flex space-x-0">{renderReadOnlyStars()}</div>;
  }

  return (
    <div
      className="flex items-center space-x-1"
      onMouseLeave={() => setHoverRating(0)}
      role="slider"
      aria-label="Rating"
      aria-valuemin={1}
      aria-valuemax={5}
      aria-valuenow={rating}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {[...Array(totalStars)].map((_, index) => renderStar(index))}
    </div>
  );
}

export default StarRating;
