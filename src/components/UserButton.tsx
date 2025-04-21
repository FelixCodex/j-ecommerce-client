import { CircleDashed, LogIn, ShoppingCart, User } from "lucide-react";
import { MouseEventHandler } from "react";
import { Link } from "react-router-dom";
import { Preferences } from "../types";
import { LANGUAGE } from "../consts";

interface UserButtonProps {
  logged: boolean;
  onClickEvent: MouseEventHandler;
  loading: boolean;
  preferences: Preferences;
}

export function UserButton({
  logged,
  preferences,
  loading,
  onClickEvent,
}: UserButtonProps) {
  return (
    <>
      {logged && (
        <Link to="/cart" className="-mr-6" onClick={onClickEvent}>
          <button
            type="button"
            className="rounded-full rounded-r-none px-6 md:px-4 py-2 sm:w-auto flex flex-row items-center justify-center gap-2 border border-transparent text-sm font-medium text-[--text_light_900] bg-[--button] hover:bg-[--button_hover] focus:outline-none focus:z-[100] focus:ring-2 focus:ring-offset-2 focus:ring-[--brand_color]"
          >
            <>
              <ShoppingCart className="h-5 w-5"></ShoppingCart>{" "}
              <span className="hidden sm:block ">
                <>{LANGUAGE.NAVBAR.CART[preferences.language]}</>
              </span>
            </>
          </button>
        </Link>
      )}
      <Link
        to={loading ? "/" : logged ? "/dashboard" : "/login"}
        className="relative"
        onClick={onClickEvent}
      >
        <div
          className={`${
            logged
              ? "hidden"
              : "rounded-full w-full grow-2 h-full top-0 px-6 md:px-4 py-2 flex z-20 bg-[--button] absolute"
          }`}
        ></div>
        <button
          type="button"
          className={`${
            logged
              ? "rounded-l-none border-l border-l-[--border_light_700]"
              : "palpite-1"
          } px-6 relative rounded-full md:px-4 py-2 w-auto flex z-40 flex-row items-center justify-center gap-2 border border-transparent text-sm font-medium text-[--text_light_900] bg-[--button] hover:bg-[--button_hover] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[--brand_color]`}
        >
          {loading ? (
            <CircleDashed className="h-6 w-6 loader"></CircleDashed>
          ) : logged ? (
            <>
              <User className="h-5 w-5"></User>{" "}
              <span className="hidden sm:block ">
                <>{LANGUAGE.NAVBAR.DASHBOARD[preferences.language]}</>
              </span>
            </>
          ) : (
            <>
              <LogIn className="h-5 w-5"></LogIn>
              <span className="hidden sm:block ">
                <>{LANGUAGE.NAVBAR.LOGIN[preferences.language]}</>
              </span>
            </>
          )}
        </button>
        <div
          className={`${
            logged
              ? "hidden"
              : "rounded-full w-full h-full top-0 px-6 md:px-4 py-2 flex z-20 bg-[--button] absolute"
          }`}
        ></div>
      </Link>
    </>
  );
}

// export function UserButton({ logged, onClickEvent }: UserButtonProps) {
//   return (
//     <>
//       {logged && (
//         <Link
//           to="/cart"
//           className="text-gray-700 hover:text-indigo-600"
//           onClick={onClickEvent}
//         >
//           <button
//             type="button"
//             className="px-4 py-2 w-14 flex flex-row items-center justify-center gap-2 border border-transparent text-sm font-medium rounded-md text-indigo-600   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//           >
//             <>
//               <ShoppingCart></ShoppingCart>
//             </>
//           </button>
//         </Link>
//       )}
//       <Link
//         to={logged ? "/dashboard" : "/login"}
//         className="text-gray-700 hover:text-indigo-600"
//         onClick={onClickEvent}
//       >
//         <button
//           type="button"
//           className="px-4 py-2 w-14 flex flex-row items-center justify-center gap-2 border border-transparent text-sm font-medium rounded-md text-indigo-600   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//         >
//           {logged ? (
//             <>
//               <User></User>
//             </>
//           ) : (
//             <>
//               <LogIn width={18} height={24}></LogIn>Login
//             </>
//           )}
//         </button>
//       </Link>
//     </>
//   );
// }
