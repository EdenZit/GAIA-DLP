// app/lib/actions/resources.ts
import { ResourceFormData } from '../validations/resource';
import Resource from '../models/resource';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function createResource(data: ResourceFormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error('Unauthorized');

  const resource = new Resource({
    ...data,
    uploadedBy: session.user.id,
    status: 'processing'
  });

  await resource.save();
  return resource;
}

export async function getResources(courseId: string) {
  return Resource.find({ courseId }).sort({ createdAt: -1 });
}

export async function updateResource(id: string, data: Partial<ResourceFormData>) {
  return Resource.findByIdAndUpdate(id, 
    { ...data, updatedAt: new Date() },
    { new: true }
  );
}

export async function deleteResource(id: string) {
  return Resource.findByIdAndDelete(id);
}
