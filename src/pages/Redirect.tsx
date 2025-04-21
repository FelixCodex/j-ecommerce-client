import { useEffect } from "react";

export default function Redirect() {
  useEffect(() => {
    location.href = `https://modelfantasy.up.railway.app/app/auth/google/callback${window.location.search}`;
  }, []);
  return <></>;
}
