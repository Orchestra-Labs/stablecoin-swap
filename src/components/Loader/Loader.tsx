import { Spinner } from '@/assets/icons';

interface LoaderProps {
  backgroundClass?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  backgroundClass = 'bg-background-black',
}) => (
  <div
    className={`${backgroundClass} w-full h-full flex items-center justify-center`}
  >
    <Spinner className="w-16 h-16 animate-spin fill-blue" />
  </div>
);
