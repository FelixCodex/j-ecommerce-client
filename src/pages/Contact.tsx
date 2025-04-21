import { Mail, Facebook, CircleDashed } from "lucide-react";
import { usePreferences } from "../hooks/usePreferences";
import { LANGUAGE } from "../consts";
import { useState } from "react";
import { sendMailRequest } from "../Api/sendEmail";

export default function Contact() {
  const { preferences } = usePreferences();

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true);

    try {
      const res = await sendMailRequest({ name, email, message });
      if (!res) return;
      if (res.status == 200) {
        setSuccess(true);
      } else {
        setSuccess(false);
      }
    } catch (error) {
      console.log(error);
      setSuccess(false);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="min-h-screen-minus-64 dottedBackground py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-[--text_light_0]">
            {LANGUAGE.CONTACT.TITLE[preferences.language]}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div
              className={`bg-[--bg_sec] rounded-lg shadow-md p-6 ${
                success != null &&
                (success
                  ? "border-b-4 border-b-green-500"
                  : "border-b-4 border-b-red-500")
              }`}
            >
              <h2 className="text-2xl font-semibold mb-6 text-[--text_light_0]">
                {LANGUAGE.CONTACT.TOUCH[preferences.language]}
              </h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-[--text_light_200] mb-1">
                    {LANGUAGE.CONTACT.NAME[preferences.language]}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border text-[--text_light_200] bg-[--bg_prim] border-[--border_light_500] rounded-md focus:outline-none focus:ring-2 focus:ring-[--brand_color]"
                    placeholder={
                      LANGUAGE.CONTACT.PLACEHOLDER_NAME[preferences.language]
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[--text_light_200] mb-1">
                    {LANGUAGE.CONTACT.EMAIL[preferences.language]}
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border text-[--text_light_200] bg-[--bg_prim] border-[--border_light_500] rounded-md focus:outline-none focus:ring-2 focus:ring-[--brand_color]"
                    placeholder={
                      LANGUAGE.CONTACT.PLACEHOLDER_EMAIL[preferences.language]
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[--text_light_200] mb-1">
                    {LANGUAGE.CONTACT.MESSAGE[preferences.language]}
                  </label>
                  <textarea
                    rows={4}
                    required
                    name="message"
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 border text-[--text_light_200] bg-[--bg_prim] border-[--border_light_500] rounded-md focus:outline-none focus:ring-2 focus:ring-[--brand_color]"
                    placeholder={
                      LANGUAGE.CONTACT.PLACEHOLDER_MESSAGE[preferences.language]
                    }
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[--button] flex justify-center items-center text-[--text_light_900] py-2 rounded-lg hover:bg-[--button_hover]"
                >
                  {loadingSubmit ? (
                    <CircleDashed className="w-6 h-6 loader"></CircleDashed>
                  ) : (
                    <span>{LANGUAGE.CONTACT.SEND[preferences.language]}</span>
                  )}
                </button>
              </form>
            </div>

            <div className="bg-[--bg_sec] rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-6 text-[--text_light_0]">
                {LANGUAGE.CONTACT.CONTACT_INFO[preferences.language]}
              </h2>
              <div className="space-y-4">
                <div className="flex items-center mb-6">
                  <Mail className="h-5 w-5 text-[--brand_color] mr-3" />
                  <span className="text-[--text_light_0]">
                    support@javierdavid.org
                  </span>
                </div>
                <div className="flex items-center mb-6">
                  <Facebook className="h-5 w-5 text-[--brand_color] mr-3" />
                  <span className="text-[--text_light_0]">
                    123 Digital Street, Tech City, TC 12345
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
