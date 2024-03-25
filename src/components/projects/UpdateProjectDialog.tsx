// import { Button } from '@/components/ui/button';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from './ui/textarea';
// import { useState } from 'react';
// import { toast } from 'sonner';
// import { parseCookies } from 'nookies';
// import server from '@/lib/utils';
// import { AxiosError } from 'axios';
// import { DropdownMenuItem } from './ui/dropdown-menu';

// export default function UpdateProjectDialog({
//   projectName1,
//   projectDesc1,
//   setProjects,
// }: {
//   projectName1: string;
//   projectDesc1: string;
//   setProjects?: React.Dispatch<React.SetStateAction<Array<object>>>;
// }) {
//   const [projectName, setProjectName] = useState<string>(projectName1 || '');
//   const [projectDesc, setProjectDesc] = useState<string>(projectDesc1 || '');
//   const [loading, setLoading] = useState<boolean>(false);
//   const [open, setOpen] = useState(false);
//   const [token] = useState<string | null>(parseCookies().userToken || null);

//   const handleProjectName = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setProjectName(e.target.value);
//     document.getElementById('projectName')?.classList.remove(...['border-red-500', 'border-2']);
//   };
//   const handleProjectDesc = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setProjectDesc(e.target.value);
//   };

//   const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.preventDefault();
//     setLoading(true);

//     if (projectName.length < 4) {
//       setLoading(false);
//       toast.warning('Project name must be at least 4 characters long');
//       document.getElementById('projectName')?.focus();
//       document.getElementById('projectName')?.classList.add(...['border-red-500', 'border-2']);
//       return;
//     }

//     try {
//       // todo: update project
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         if (error.response?.status === 400) {
//           const res = error.response.data.errors[0].message || 'An error occurred while creating the project';
//           toast.warning(res);
//         }

//         if (error.response?.status === 409) {
//           toast.error('Project with this name already exists', {
//             description: 'Use Different Name OR "Rename Project Later to this name.',
//           });
//         }
//       } else {
//         toast.error('An error occurred while creating the project');
//       }
//       setLoading(false);
//       return;
//     }

//     // setLoading(false);
//     // setOpen(false);
//     return;
//   };

//   return (
//     <Dialog
//       open={open}
//       onOpenChange={() => {
//         setOpen(!open);
//       }}
//     >
//       <DialogTrigger asChild>
//         <DropdownMenuItem>Edit Project</DropdownMenuItem>
//       </DialogTrigger>
//       <DialogContent className="max-w-[20rem] md:max-w-[28rem]">
//         <DialogHeader>
//           <DialogTitle>Create Projects</DialogTitle>
//           <DialogDescription>Add a new project to your workspace.</DialogDescription>
//         </DialogHeader>
//         <Label htmlFor="name" className="text-left flex">
//           Name <div className="text-red-600">*</div>
//         </Label>
//         <Input
//           id="projectName"
//           placeholder="my-cool-project"
//           value={projectName}
//           required={true}
//           onChange={handleProjectName}
//         />
//         <Label htmlFor="name" className="text-left">
//           Description
//         </Label>
//         <Textarea
//           id="projectDesc"
//           placeholder="A short description of your project"
//           value={projectDesc}
//           onChange={handleProjectDesc}
//         />

//         <DialogFooter>
//           <Button onClick={handleSubmit} disabled={loading}>
//             Save changes
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
