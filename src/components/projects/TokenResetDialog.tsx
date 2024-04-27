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
import { parseCookies } from 'nookies';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ResetProjectToken({
  projectSlug,
  setProjectToken,
}: {
  projectSlug: string;
  setProjectToken: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteText, setDeleteText] = useState<string>('');
  const [isDeleteDisabled, setIsDeleteDisabled] = useState<boolean>(true);
  const [token] = useState<string | null>(parseCookies().userToken || null);

  const handleDeleteText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeleteText(e.target.value);
    if (e.target.value === 'confirm') {
      setIsDeleteDisabled(false);
    } else {
      setIsDeleteDisabled(true);
      document
        .getElementById('projectName')
        ?.classList.remove(...['border-red-500', 'border-2']);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (deleteText !== 'confirm') {
      setLoading(false);
      toast.warning('Please write "confirm" to confirm');
      document.getElementById('projectName')?.focus();
      document
        .getElementById('projectName')
        ?.classList.add(...['border-red-500', 'border-2']);
      return;
    }

    try {
      const res = await server.post(
        `/api/project/${projectSlug}/token`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status !== 201) {
        console.error('Unexpected Response from Server', res.status);
        toast.error('Unexpected Response from Server');
        return;
      }

      const data = res.data.projectToken;
      setProjectToken(data);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          toast.warning('Please Re-Login to Continue', {
            description: `status: ${error.response.status}`,
          });
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
        <Button variant="destructive">Reset Token</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[20rem] md:max-w-[28rem]">
        <DialogHeader>
          <DialogTitle>Reset Project Token</DialogTitle>
          <DialogDescription>
            This will reset the access token for the project {projectSlug}
          </DialogDescription>
        </DialogHeader>
        <Label htmlFor="name" className="text-left flex">
          Confirm by writing "confirm" <div className="text-red-600">*</div>
        </Label>
        <Input
          type="text"
          placeholder='Write "confirm" to proceed'
          onChange={handleDeleteText}
        />
        <DialogFooter>
          <Button
            variant={'destructive'}
            onClick={handleSubmit}
            disabled={loading || isDeleteDisabled}
          >
            Confirm Reset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
