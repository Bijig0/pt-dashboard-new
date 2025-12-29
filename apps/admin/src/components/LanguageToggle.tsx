import { Dropdown } from "flowbite-react";
import { HiTranslate } from "react-icons/hi";
import { useLocale } from "../context/LocaleContext";
import { Locale } from "../locales/translations";

const LanguageToggle = () => {
  const { locale, setLocale } = useLocale();

  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale);
  };

  return (
    <Dropdown
      arrowIcon={false}
      inline
      label={
        <span className="cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
          <HiTranslate className="h-6 w-6" />
        </span>
      }
    >
      <Dropdown.Header>
        <span className="block text-sm font-medium">Language / Bahasa</span>
      </Dropdown.Header>
      <Dropdown.Item
        onClick={() => handleLanguageChange("en")}
        className={locale === "en" ? "bg-gray-100 dark:bg-gray-700" : ""}
      >
        <div className="flex items-center gap-2">
          {locale === "en" && <span>✓</span>}
          <span>English</span>
        </div>
      </Dropdown.Item>
      <Dropdown.Item
        onClick={() => handleLanguageChange("id")}
        className={locale === "id" ? "bg-gray-100 dark:bg-gray-700" : ""}
      >
        <div className="flex items-center gap-2">
          {locale === "id" && <span>✓</span>}
          <span>Bahasa Indonesia</span>
        </div>
      </Dropdown.Item>
    </Dropdown>
  );
};

export default LanguageToggle;
