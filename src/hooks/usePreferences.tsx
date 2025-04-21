import { useEffect, useState } from "react";
import { Language, Preferences } from "../types";
import { useAuth } from "./useAuth";
import { saveInLocalStorage } from "../utils";

export function usePreferences() {
  const { user } = useAuth();
  const userLanguage = localStorage.getItem("language") ?? "en";

  const [preferences, setPreferences] = useState<Preferences>({
    language: userLanguage as Language,
    currency: "EUR",
    notifications: true,
  });

  useEffect(() => {
    if (user) {
      setPreferences(user.preferences);
      saveInLocalStorage({ item: "language", value: preferences.language });
    }
  }, [user, preferences]);

  return { preferences, setPreferences };
}
