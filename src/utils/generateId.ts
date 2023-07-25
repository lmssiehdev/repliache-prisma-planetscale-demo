import { customAlphabet } from "nanoid";

/**
 * @see https://github.com/ai/nanoid#custom-alphabet-or-size
 */
export const generateId = (n = 6) => {
  const nanoid = customAlphabet(
    "0123456789ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
    n
  );

  return nanoid();
};
