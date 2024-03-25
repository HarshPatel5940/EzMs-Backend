import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import server from '@/lib/utils';
import { AxiosError } from 'axios';
import { Trash2Icon } from 'lucide-react';
import { parseCookies } from 'nookies';
import { useState } from 'react';
import { toast } from 'sonner';

export default function DeleteProjectDialog({
  projectSlug,
  setProjects,
}: {
  projectSlug: string;
  setProjects?: React.Dispatch<React.SetStateAction<Array<object>>>;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteText, setDeleteText] = useState<string>('');
  const [isDeleteDisabled, setIsDeleteDisabled] = useState<boolean>(true);
  const [token] = useState<string | null>(parseCookies().userToken || null);

  const handleDeleteText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeleteText(e.target.value);
    if (e.target.value === 'delete') {
      setIsDeleteDisabled(false);
    } else {
      setIsDeleteDisabled(true);
      document.getElementById('projectName')?.classList.remove(...['border-red-500', 'border-2']);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (deleteText !== 'delete') {
      setLoading(false);
      toast.warning('Please write "delete" to confirm');
      document.getElementById('projectName')?.focus();
      document.getElementById('projectName')?.classList.add(...['border-red-500', 'border-2']);
      return;
    }

    try {
      const res = await server.delete(`/api/project/${projectSlug}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status !== 200) {
        console.error('Unexpected Response from Server', res.status);
        toast.error('Unexpected Response from Server');
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setProjects?.(prev => prev.filter((project: any) => project.slug !== projectSlug));
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          toast.warning('Please Re-Login to Continue');
          return;
        }
        if (error.response?.status === 401) {
          toast.warning('Please Re-Login. Token Expired!');
          return;
        }
      }
      toast.error('Unexpected Error Occured');
      toast.info('Please Try Again Later or Try after Relogin');
    }

    setLoading(false);
    setOpen(false);
    return;
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(!open);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Trash2Icon className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[20rem] md:max-w-[28rem]">
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>This will delete project {projectSlug}</DialogDescription>
        </DialogHeader>
        <Label htmlFor="name" className="text-left flex">
          Confirm by writing "delete" <div className="text-red-600">*</div>
        </Label>
        <Input type="text" placeholder='Write "delete" to proceed' onChange={handleDeleteText} />
        <DialogFooter>
          <Button variant={'destructive'} onClick={handleSubmit} disabled={loading || isDeleteDisabled}>
            Delete Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
