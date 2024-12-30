import { connectToDatabase } from "@/app/lib/mongodb";
import Course from "@/app/models/Course";
import Resource from "@/app/models/Resource";

export async function testCourseCreation() {
  try {
    await connectToDatabase();
    
    // Test course data
    const testCourse = {
      title: "Test Course",
      description: "This is a test course",
      category: "Test Category",
      level: "Beginner",
      published: false
    };
    
    // Create test course
    const course = await Course.create(testCourse);
    
    // Test resource creation
    const testResource = {
      title: "Test Resource",
      type: "document",
      url: "test-url",
      courseId: course._id
    };
    
    const resource = await Resource.create(testResource);
    
    return {
      success: true,
      course,
      resource,
      message: "Course and resource creation test completed successfully"
    };
  } catch (error) {
    console.error("Course creation test failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Course creation test failed"
    };
  }
}

export async function testResourceUpload(courseId: string, file: File) {
  try {
    // Simulate file upload
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`/api/courses/${courseId}/resources`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Resource upload failed');
    }
    
    const result = await response.json();
    
    return {
      success: true,
      data: result,
      message: "Resource upload test completed successfully"
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Resource upload test failed"
    };
  }
}
