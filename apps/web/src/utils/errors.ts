export const getErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    const msg = error.response.data.message.toLowerCase();
    if (msg.includes("already exists")) return "User already exists";
    if (msg.includes("invalid") || msg.includes("credentials"))
      return "Invalid credentials";
    if (msg.includes("unauthorized") || msg.includes("not authenticated"))
      return "Unauthorized";
    return error.response.data.message;
  }
  return error.message || "An unexpected error occurred";
};
