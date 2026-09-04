interface IconProps {
    size?: number;
    className?: string;
  }
  
  /** Document being raked by a scan beam */
  export function IconExtract({ size = 30, className = "" }: IconProps) {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
        <path d="M9 4h10l5 5v19H9z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M19 4v5h5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M12.5 14h7M12.5 17.5h7M12.5 21h4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.55" />
        <path d="M5 9.5h2.5M5 13h2.5M5 16.5h2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />
        <path d="M4 25.5h24" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="2.5 3" />
      </svg>
    );
  }
  
  /** Gauge dial with needle */
  export function IconGauge({ size = 30, className = "" }: IconProps) {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
        <path d="M4.5 23a12 12 0 1 1 23 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M8 8.8l1.6 1.6M24 8.8l-1.6 1.6M16 5v2.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
        <path d="M16 23 22.4 13.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="16" cy="23" r="2.2" fill="currentColor" />
        <path d="M9 27h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="2.5 3" opacity="0.8" />
      </svg>
    );
  }
  
  /** Chat bubble with a spark */
  export function IconCoach({ size = 30, className = "" }: IconProps) {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
        <path d="M5 8.5A2.5 2.5 0 0 1 7.5 6h17A2.5 2.5 0 0 1 27 8.5v10a2.5 2.5 0 0 1-2.5 2.5H13l-5.5 5v-5h-.5A2.5 2.5 0 0 1 5 18.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M16.8 9.2l.9 2.5 2.5.9-2.5.9-.9 2.5-.9-2.5-2.5-.9 2.5-.9z" fill="currentColor" />
        <path d="M10.5 17.5h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
      </svg>
    );
  }
  
  /** Arrow that travels on group-hover */
  export function IconArrow({ size = 18, className = "" }: IconProps) {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
        <path d="M3 10h13M11 4.5 16.5 10 11 15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  
  /** Flag for red-flag lists */
  export function IconFlag({ size = 14, className = "" }: IconProps) {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
        <path d="M3.5 1.5v13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M3.5 2.5h8.2l-2.2 3 2.2 3H3.5z" fill="currentColor" opacity="0.9" />
      </svg>
    );
  }
  
  /** Lock / privacy mark */
  export function IconLock({ size = 16, className = "" }: IconProps) {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
        <rect x="3" y="7" width="10" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.4" />
        <path d="M5.2 7V5a2.8 2.8 0 1 1 5.6 0v2" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="8" cy="10.5" r="1.1" fill="currentColor" />
      </svg>
    );
  }
  
  /** Check used in pricing lists */
  export function IconCheck({ size = 14, className = "" }: IconProps) {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
        <path d="m2.5 8.4 3.4 3.4L13.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  
  /** Plus for accordion */
  export function IconPlus({ size = 16, className = "" }: IconProps) {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
        <path d="M8 2.5v11M2.5 8h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  