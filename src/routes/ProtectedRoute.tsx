import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.tsx";
import { replaceString } from "../utils.ts";

function BG_Loader() {
  return (
    <div
      title="Loading..."
      className="w-full h-44 bg-[--bg_protected_loading] bg-loader rounded-2xl"
    ></div>
  );
}

export default function ProtectedRoute() {
  const { logged, loadingLog } = useAuth();
  const location = useLocation();
  const path = replaceString(location.pathname, "/", "-");

  if (loadingLog)
    return (
      <main className="w-full h-full dottedBackground flex items-center justify-center py-10">
        <section className="max-w-5xl w-full h-full flex flex-col items-center justify-center gap-5">
          <div className="w-full gap-5 flex items-center justify-center">
            <BG_Loader />
            <BG_Loader />
          </div>
          <BG_Loader />
          <BG_Loader />
          <div className="w-full gap-5 flex items-center justify-center">
            <BG_Loader />
            <BG_Loader />
          </div>
        </section>
      </main>
    );
  if (!loadingLog && !logged)
    return <Navigate to={`/login?path=${path}`} replace></Navigate>;

  return <Outlet></Outlet>;
}
