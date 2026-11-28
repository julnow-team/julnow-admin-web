import logo from '../assets/logo.png'

// The logo file has empty space around it, so it is cropped with percentages.
// The size is set from outside with className, keep the ratio 124 : 69.
export default function Logo({ className = 'h-[69px] w-[124px]' }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={logo}
        alt="JulNow"
        className="logo absolute max-w-none"
        style={{ width: '142.27%', height: '255.56%', left: '-20.62%', top: '-81.48%' }}
      />
    </div>
  )
}
