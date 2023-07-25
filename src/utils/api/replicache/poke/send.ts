import Pusher from "pusher";

export const sendPoke = async () => {
  console.log("Poke");

  const pusher = new Pusher({
    appId: process.env.NEXT_PUBLIC_PUSHER_REPLICACHE_APPID!,
    key: process.env.NEXT_PUBLIC_PUSHER_REPLICACHE_KEY!,
    secret: process.env.PUSHER_REPLICACHE!,
    cluster: process.env.NEXT_PUBLIC_PUSHER_REPLICACHE_CLUSTER!,
    useTLS: true,
  });

  // We need to use `await` here, otherwise Next.js will frequently kill the request and the poke won't get sent.
  await pusher.trigger(
    process.env.NEXT_PUBLIC_PUSHER_CHANNEL_NAME!,
    "poke",
    {}
  );

  return;
};
