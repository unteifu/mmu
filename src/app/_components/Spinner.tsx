import React from "react";

interface SpinnerProps {
  size?: number;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 80 }) => {
  return (
    <div
      className="relative inline-block text-current"
      style={{ width: size, height: size }}
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="absolute left-0 top-0 h-full w-full"
          style={{
            transformOrigin: `${size / 2}px ${size / 2}px`,
            transform: `rotate(${i * 30}deg)`,
            animation: "spinner 1.2s linear infinite",
            animationDelay: `${-1.1 + i * 0.1}s`,
          }}
        >
          <div
            className="absolute rounded-[20%] bg-current"
            style={{
              top: `${size * 0.04}px`,
              left: `${size * 0.46}px`,
              width: `${size * 0.08}px`,
              height: `${size * 0.22}px`,
            }}
          ></div>
        </div>
      ))}
    </div>
  );
};

export default Spinner;
