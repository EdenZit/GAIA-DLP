interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
}

export function Badge({ 
  children, 
  className = '', 
  variant = 'default',
  ...props 
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none'
  
  const variants = {
    default: 'border-transparent bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200',
    destructive: 'border-transparent bg-red-500 text-white hover:bg-red-600',
    outline: 'border-gray-200 text-gray-900 hover:bg-gray-100'
  }
  
  const variantStyles = variants[variant]
  
  return (
    <div
      className={`${baseStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
