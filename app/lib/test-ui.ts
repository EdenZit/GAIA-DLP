import { z } from "zod";

// Form validation schemas
const formValidationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2)
});

export async function testFormValidation(formData: unknown) {
  try {
    const result = formValidationSchema.safeParse(formData);
    
    return {
      success: result.success,
      data: result.success ? result.data : undefined,
      errors: !result.success ? result.error.flatten() : undefined
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Form validation failed"
    };
  }
}

export function testResponsiveness() {
  const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280
  };
  
  return {
    currentBreakpoint: Object.entries(breakpoints).reduce((acc, [key, value]) => {
      if (typeof window !== 'undefined' && window.innerWidth >= value) {
        return key;
      }
      return acc;
    }, 'xs'),
    isResponsive: true
  };
}

export function testErrorBoundary(callback: () => void) {
  try {
    callback();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error boundary test failed"
    };
  }
}
