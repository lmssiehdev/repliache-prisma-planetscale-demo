import { getCookie } from "cookies-next";

export const isLoggedIn = async (req: any, res: any) => {
  // In this demo, we’re just using basic cookies and not implementing a secure authentication system since auth isn’t the purpose of this demo. In a production app you’d implement a secure authentication system.
  const userId = getCookie("userId", { req, res });

  if (!userId) return { error: "user_not_found" };

  return { data: userId };
};
