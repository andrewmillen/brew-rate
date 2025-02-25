"use client";

import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

function StarRating({ rating, onChange, readOnly = false }) {
  const [hoverRating, setHoverRating] = useState(0);
  const totalStars = 5;

  const handleMouseMove = (index) => {
    if (readOnly) return;
    setHoverRating(index + 1);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverRating(0);
  };

  const handleClick = (index) => {
    if (readOnly) return;
    onChange(index + 1);
  };

  const renderStar = (index) => {
    const value = hoverRating || rating;
    const filled = value > index;
    const starClass = readOnly ? "cursor-default" : "cursor-pointer";

    return (
      <div
        key={index}
        className={`relative inline-block w-6 h-6 ${starClass}`}
        onMouseEnter={() => handleMouseMove(index)}
        onClick={() => handleClick(index)}
      >
        <StarOutlineIcon className="absolute w-6 h-6 text-gray-300" />
        {filled && <StarIcon className="absolute w-6 h-6 text-yellow-400" />}
      </div>
    );
  };

  const renderReadOnlyStars = () => {
    return [...Array(rating || 0)].map((_, index) => (
      <StarIcon key={index} className="w-6 h-6 text-yellow-400" />
    ));
  };

  if (readOnly) {
    return <div className="flex space-x-0">{renderReadOnlyStars()}</div>;
  }

  return (
    <div
      className="flex items-center space-x-1"
      onMouseLeave={handleMouseLeave}
    >
      {[...Array(totalStars)].map((_, index) => renderStar(index))}
      <span className="ml-1 text-sm text-gray-600">
        {hoverRating || rating || 0}/5
      </span>
    </div>
  );
}

export default StarRating;
