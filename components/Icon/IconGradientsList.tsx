const primaryGradient = (
  <svg width="0" height="0">
    <linearGradient id="primary-gradient" x1="100%" y1="100%" x2="0%" y2="0%">
      <stop stopColor="#1371FD" offset="0%" />
      <stop stopColor="#18E3BB" offset="100%" />
    </linearGradient>
  </svg>
);

export const IconGradientsList = () => {
  return <div className="absolute">{primaryGradient}</div>;
};
