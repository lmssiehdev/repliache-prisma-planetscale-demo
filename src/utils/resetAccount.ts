import { deleteCookie } from "cookies-next";
import { type Dispatch, type SetStateAction } from "react";

export const resetAccount = ({
  setSpaceId,
  setUserId,
}: {
  setSpaceId: Dispatch<SetStateAction<string | null>>;
  setUserId: Dispatch<SetStateAction<string | null>>;
}) => {
  deleteCookie("userId");
  setUserId(null);

  window.localStorage.removeItem("spaceId1");
  setSpaceId(null);
};
