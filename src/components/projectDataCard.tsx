import { LinkIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import { toast } from 'sonner';
import DeleteImageDialog from '@/components/projectData/DeleteImageDialog';
import UpdateProjectDialog from './projectData/UpdateProjectDataDialog';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '@/lib/utils';

export interface ProjectData {
  id: string;
  projectId: string;
  title: string;
  description: string;
  imageUrl: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  setProjectData: React.Dispatch<React.SetStateAction<ProjectData[]>>;
}

export default function MyProjectDataCard(props: ProjectData) {
  function DateFormatter(date: string): string {
    const d = new Date(date);
    return `${d.toLocaleTimeString()} ${d.toLocaleDateString()}`;
  }

  return (
    <Card>
      <CardHeader>
        <img
          src={props.imageUrl}
          alt="project"
          className="w-full h-64 object-cover"
        />
      </CardHeader>
      <CardContent className="space-y-1">
        <CardTitle>{props.title}</CardTitle>
        <CardDescription className="flex flex-col space-y-3">
          {props.description ? props.description : 'No Descrpition Provided'}
          <div>
            Image Source URL:{' '}
            <Link className="text-blue-500" to={props.imageUrl}>
              Source 🔗
            </Link>
          </div>
        </CardDescription>
        <div className="flex align-middle">
          <LinkIcon size={21} className="pt-1" />
          {props.url ? (
            <Link className="text-blue-500" to={props.url}>
              {props.url}
            </Link>
          ) : (
            <CardDescription>No Link Provided</CardDescription>
          )}
        </div>
        <div>
          <div>Created At: {DateFormatter(props.createdAt)}</div>
          <div>Updated At: {DateFormatter(props.updatedAt)}</div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        <div className="flex justify-around text-center w-full rounded-lg gap-2">
          <Button
            className="w-full"
            onClick={() => {
              navigator.clipboard.writeText(
                `${API_BASE_URL}/api/public/project/${props.projectId}/data/${props.id}`
              );
              toast('Copied to clipboard', {
                description:
                  'Make sure to use the Project Token to access this data!\nOrelse, Feel Free to use Source URL',
              });
            }}
          >
            Copy 🔗
          </Button>

          {UpdateProjectDialog({
            projectData: props,
          })}

          {DeleteImageDialog({
            imageId: props.id,
            projectSlug: props.projectId,
            setProjectData: props.setProjectData,
          })}
        </div>
      </CardFooter>
    </Card>
  );
}
