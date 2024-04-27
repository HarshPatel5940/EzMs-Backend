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
import { AxiosError, type AxiosResponse } from 'axios';
import { parseCookies } from 'nookies';
import { useState } from 'react';
import { toast } from 'sonner';
import { Textarea } from '../ui/textarea';
import type { ProjectData } from '../projectDataCard';

export default function UpdateProjectDataDialog({
  projectData,
}: {
  projectData: ProjectData;
}) {
  const [imageTitle, setImageTitle] = useState<string>(projectData.title);
  const [imageDesc, setImageDesc] = useState<string>(projectData.description);
  const [url, setUrl] = useState<string>(projectData.url);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [token] = useState<string | null>(parseCookies().userToken || null);

  const handleImageName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageTitle(e.target.value);
    document
      .getElementById('imageTitle')
      ?.classList.remove(...['border-red-500', 'border-2']);
  };
  const handleImageDesc = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setImageDesc(e.target.value);
  };

  const handleImageURL = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);

    if (imageTitle.length < 4) {
      setLoading(false);
      toast.warning('Image name must be at least 4 characters long');
      document.getElementById('imageTitle')?.focus();
      document
        .getElementById('imageTitle')
        ?.classList.add(...['border-red-500', 'border-2']);
      return;
    }

    let res: AxiosResponse;

    try {
      res = await server.patch(
        `/api/project/${projectData.projectId}/data/${projectData.title}`,
        {
          title: imageTitle,
          description: imageDesc,
          url: url,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status !== 200) {
        toast.warning(`Unexpected Response Code - ${res.status}`);
        return;
      }

      const data = res.data;

      data.key = res.data.title;

      projectData.setProjectData(prev => {
        const newPrev = prev.filter(
          (project: ProjectData) => project.title !== projectData.title
        );

        return [data, ...newPrev];
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          const res =
            error.response.data.message ||
            'An error occurred while updating the project';
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
    } finally {
      setLoading(false);
    }

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
        <Button className="w-full bg-blue-600 hover:bg-blue-500 bg-opacity-90">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[20rem] md:max-w-[28rem]">
        <DialogHeader>
          <DialogTitle>Update Image Details</DialogTitle>
          <DialogDescription>
            Update an exsisting images details here!
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label htmlFor="name" className="text-left flex">
            New Image Title
          </Label>
          <Input
            id="imageTitle"
            placeholder="my-cool-image-title / Ex: Sponsor Name"
            required={true}
            defaultValue={projectData.title}
            onChange={handleImageName}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="name" className="text-left">
            New Image Description
          </Label>
          <Textarea
            id="imageDesc"
            placeholder="A short description of your image"
            defaultValue={projectData.description}
            onChange={handleImageDesc}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="name" className="text-left flex">
            Image Redirect URL
          </Label>
          <Input
            id="imageURL"
            placeholder="The URL you want to link with image"
            required={true}
            type="url"
            defaultValue={projectData.url}
            onChange={handleImageURL}
          />
        </div>
        <div className="text-xs text-gray-500 font-bold">
          Tip: Edit these misc details and easily manage the images you looking
          for on the client side!
        </div>
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={
              loading ||
              imageTitle.length < 4 ||
              (url ? url.length < 10 : false)
            }
          >
            Update Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
