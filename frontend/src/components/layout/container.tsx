interface ContainerProps {
  maxWidth?: 580 | 780 | 980 | 1280;
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export default function Container({
  maxWidth = 1280,
  className,
  children,
  style,
  ...props
}: ContainerProps) {
  return (
    <div
      className={className}
      style={{
        width: '100%',
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        padding: '0 1rem',
        maxWidth: `${maxWidth}px`,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
