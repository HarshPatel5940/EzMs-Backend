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
import { type ChangeEvent, useState } from 'react';
import { toast } from 'sonner';
import { Textarea } from '../ui/textarea';
import type { ProjectData } from '../projectDataCard';

export default function CreateProjectDataDialog({
  projectSlug,
  setProjectData,
}: {
  projectSlug: string;
  setProjectData: React.Dispatch<React.SetStateAction<ProjectData[]>>;
}) {
  const [imageTitle, setImageTitle] = useState<string>('');
  const [imageDesc, setImageDesc] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [image, setImage] = useState<File>();
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleImageURL = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
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

    if (!image) return;
    const toastId = toast.info('Uploading Data...');

    let res: AxiosResponse;

    try {
      res = await server.postForm(
        `/api/project/${projectSlug}/data/new`,
        {
          title: imageTitle,
          description: imageDesc,
          image: image,
          url: imageUrl,
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

      data.key = res.data.title;

      setProjectData(prev => [...prev, data]);
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
    toast.success('Data Added Successfully');
    toast.dismiss(toastId);
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
        <Button>Add Image</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[20rem] md:max-w-[28rem]">
        <DialogHeader>
          <DialogTitle>Add An Image</DialogTitle>
          <DialogDescription>
            Add a new image which you can easily share and start using.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label htmlFor="name" className="text-left flex">
            Image Title <div className="text-red-600">*</div>
          </Label>
          <Input
            id="imageTitle"
            placeholder="my-cool-image-title / Ex: Sponsor Name"
            required={true}
            onChange={handleImageName}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="name" className="text-left">
            Image Description
          </Label>
          <Textarea
            id="imageDesc"
            placeholder="A short description of your image"
            onChange={handleImageDesc}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="name" className="text-left flex">
            Upload Image <div className="text-red-600">*</div>
          </Label>
          <Input
            id="image-ProjectData"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
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
            onChange={handleImageURL}
          />
        </div>
        <div className="text-xs text-gray-500 font-bold">
          Tip: Images are uploaded to quickly use in your frontend apps or share
          it with others...
        </div>
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={
              loading ||
              imageTitle.length < 4 ||
              (imageUrl ? imageUrl.length < 10 : false) ||
              !image
            }
          >
            Add Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
