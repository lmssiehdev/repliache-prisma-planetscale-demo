import { getCookie } from "cookies-next";
import { useEffect, type Dispatch, type SetStateAction } from "react";

export const useOnLoad = ({
  setSpaceId,
  setUserId,
}: {
  setSpaceId: Dispatch<SetStateAction<string | null>>;
  setUserId: Dispatch<SetStateAction<string | null>>;
}) => {
  useEffect(() => {
    setSpaceId(window.localStorage.getItem("spaceId1"));

    setUserId(getCookie("userId"));
  }, []);
};
