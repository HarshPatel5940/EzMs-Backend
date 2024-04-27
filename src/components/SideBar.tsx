import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

export default function SideBar({ baseUrl }: { baseUrl: string }) {
  return (
    <div className="flex flex-col items-start h-screen p-3 gap-3">
      <Link to={baseUrl} className="w-full">
        <Button className="w-full text-center" variant={'ghost'}>
          Manage Data
        </Button>
      </Link>
      <Separator />
      <Link to={`${baseUrl}/users/manage`} className="w-full">
        <Button className="w-full text-center" variant={'ghost'}>
          Manage Access
        </Button>
      </Link>
      <Separator />
      <Link to={`${baseUrl}/manage`} className="w-full">
        <Button className="w-full text-center" variant={'ghost'}>
          Manage Project
        </Button>
      </Link>
      <Separator />
    </div>
  );
}
