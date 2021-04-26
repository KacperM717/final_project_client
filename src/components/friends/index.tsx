import { useEffect } from "react";
import fetcher from "../../fetcher";

import { useFriends } from "../../friends.context";
import { FriendList } from "./FriendList";

export const Friends = () => {
  const [, friendsDispatch] = useFriends();

  // useFriendFetch
  useEffect(() => {
    (async () => {
      const res = await fetcher.BASE("/friend/list");
      const { msg, body, errors } = await res.json();
      if (!res.ok) return console.error("Error in Friends resource");
      console.log("Anyyyy errors", body, errors, msg);
      friendsDispatch({ type: "setAll", payload: body.friends });
    })();
  }, []);

  return (
    <div>
      <FriendList />
    </div>
  );
};
