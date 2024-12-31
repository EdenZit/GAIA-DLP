// app/lib/actions/resources.ts
'use server';

import { ResourceFormData } from '../validations/resource';
import Resource from '../models/resource';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Course from '@/app/models/Course';

export async function createResource(data: ResourceFormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error('Unauthorized');

  const resource = new Resource({
    ...data,
    uploadedBy: session.user.id,
    status: 'processing'
  });
  await resource.save();

  // If courseId is provided, add to course resources
  if (data.courseId) {
    const course = await Course.findById(data.courseId);
    if (course) {
      course.resources.push(resource._id);
      await course.save();
    }
  }

  return resource;
}

export async function getResources(courseId: string) {
  return Resource.find({ courseId })
    .sort({ createdAt: -1 })
    .populate('uploadedBy', 'name email');
}

export async function updateResource(id: string, data: Partial<ResourceFormData>) {
  return Resource.findByIdAndUpdate(
    id, 
    { ...data, updatedAt: new Date() },
    { new: true }
  ).populate('uploadedBy', 'name email');
}

export async function deleteResource(id: string, courseId?: string) {
  // Remove from course if courseId provided
  if (courseId) {
    const course = await Course.findById(courseId);
    if (course) {
      course.resources = course.resources.filter(r => r.toString() !== id);
      await course.save();
    }
  }
  
  return Resource.findByIdAndDelete(id);
}
