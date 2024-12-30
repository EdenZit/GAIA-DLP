import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/utils/auth-config";

export async function testAuthFlow() {
  try {
    // Test session retrieval
    const session = await getServerSession(authOptions);
    console.log("Session test:", session ? "Active" : "Inactive");
    
    return {
      success: true,
      session: session,
      message: "Authentication flow test completed successfully"
    };
  } catch (error) {
    console.error("Auth flow test failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Authentication flow test failed"
    };
  }
}

export async function validateProtectedRoute(
  callback: () => Promise<any>
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return {
        success: false,
        error: "Unauthorized access - No valid session"
      };
    }
    
    const result = await callback();
    return {
      success: true,
      data: result
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Protected route validation failed"
    };
  }
}
