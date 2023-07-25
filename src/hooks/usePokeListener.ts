import { useState, useEffect } from "react";
import Pusher from "pusher-js";

export const usePokeListener = ({ rep }: { rep: any }) => {
  const [pusherHasLoaded, setPusherHasLoaded] = useState(false);

  useEffect(() => {
    if (!pusherHasLoaded && rep) {
      console.log("Listening for pokes");

      // Listen for pokes, and pull whenever we get one.
      Pusher.logToConsole = true;

      const pusher = new Pusher(
        process.env.NEXT_PUBLIC_PUSHER_REPLICACHE_KEY!,
        {
          cluster: process.env.NEXT_PUBLIC_PUSHER_REPLICACHE_CLUSTER!,
        }
      );

      const channel = pusher.subscribe(
        process.env.NEXT_PUBLIC_PUSHER_CHANNEL_NAME!
      );

      channel.bind("poke", () => {
        console.log("Got poked!");

        rep.pull();
      });

      setPusherHasLoaded(true);

      return () =>
        pusher.unsubscribe(process.env.NEXT_PUBLIC_PUSHER_CHANNEL_NAME!);
    }
  }, [rep]);
};
