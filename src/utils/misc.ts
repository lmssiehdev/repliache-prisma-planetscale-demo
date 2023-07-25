/**
  Retrieves the error message from an error object or any other value.
  
  @param error - The error object.
  @returns The error message.
*/
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
