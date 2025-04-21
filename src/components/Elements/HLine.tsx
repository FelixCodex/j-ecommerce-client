interface HLineProps {
  style: object;
}

export function HLine({ style }: HLineProps) {
  return (
    // <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className={className}>
    //   <path d="M16 18H3"></path>
    // </svg>
    <svg
      width="65"
      height="5"
      className="absolute hidden md:block"
      id="line"
      style={style}
    >
      <line
        x1="0"
        y1="0"
        x2="100%"
        y2="0"
        stroke="var(--brand_color)"
        strokeWidth="3"
      />
    </svg>
  );
}
