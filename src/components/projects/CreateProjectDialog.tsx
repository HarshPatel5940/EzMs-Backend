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
import { Textarea } from '../ui/textarea';
import type { Project } from '@/pages/project/manageProjectData';

export default function CreateProjectDialog({
  setProjects,
}: {
  setProjects: React.Dispatch<React.SetStateAction<Array<Project>>>;
}) {
  const [projectName, setProjectName] = useState<string>('');
  const [projectDesc, setProjectDesc] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [token] = useState<string | null>(parseCookies().userToken || null);

  const handleProjectName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectName(e.target.value);
    document
      .getElementById('projectName')
      ?.classList.remove(...['border-red-500', 'border-2']);
  };
  const handleProjectDesc = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProjectDesc(e.target.value);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);

    if (projectName.length < 4) {
      setLoading(false);
      toast.warning('Project name must be at least 4 characters long');
      document.getElementById('projectName')?.focus();
      document
        .getElementById('projectName')
        ?.classList.add(...['border-red-500', 'border-2']);
      return;
    }

    try {
      const res = await server.post(
        '/api/project/new',
        {
          projectName,
          projectDesc,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status !== 201) {
        toast.warning(`Unexpected Response Code - ${res.status}`);
        return;
      }
      const data = res.data;
      data.ProjectData = [];
      setProjects(prev => [...prev, data]);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          const res =
            error.response.data.errors[0].message ||
            'An error occurred while creating the project';
          toast.warning(res);
        }

        if (error.response?.status === 409) {
          toast.error('Project with this name already exists', {
            description:
              'Use Different Name OR "Rename Project Later to this name.',
          });
        }
      } else {
        toast.error('An error occurred while creating the project');
      }
      setLoading(false);
      return;
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
        <Button>Create Project</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[20rem] md:max-w-[28rem]">
        <DialogHeader>
          <DialogTitle>Create Projects</DialogTitle>
          <DialogDescription>
            Add a new project to your workspace.
          </DialogDescription>
        </DialogHeader>
        <Label htmlFor="name" className="text-left flex">
          Name <div className="text-red-600">*</div>
        </Label>
        <Input
          id="projectName"
          placeholder="my-cool-project"
          required={true}
          onChange={handleProjectName}
        />
        <Label htmlFor="name" className="text-left">
          Description
        </Label>
        <Textarea
          id="projectDesc"
          placeholder="A short description of your project"
          onChange={handleProjectDesc}
        />
        <div className="text-xs text-gray-500 font-bold">
          Tip: Projects are used to organize your images and who can access
          them.
        </div>
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={loading || projectName.length < 4}
          >
            Create Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
