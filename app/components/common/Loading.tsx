// app/components/common/Loading.tsx
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  message?: string;
}

const Loading = ({ message = 'Loading...' }: LoadingProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-4">
      <Loader2 className="h-8 w-8 animate-spin mb-2" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
};

export default Loading;
