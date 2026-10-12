import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import en from "./locales/en"
import pl from "./locales/pl"

export const LANGUAGES = [
  { id: "en", label: "English" },
  { id: "pl", label: "Polski" }
] as const
export type LanguageId = (typeof LANGUAGES)[number]["id"]

const STORAGE_KEY = "axis:lang"

const isSupported = (value: string | null | undefined): value is LanguageId =>
  LANGUAGES.some(language => language.id === value)

const detect = (): LanguageId => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (isSupported(stored)) return stored
  } catch {
    // storage unavailable: fall through
  }
  const browser = navigator.language?.slice(0, 2).toLowerCase()
  return isSupported(browser) ? browser : "en"
}

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, pl: { translation: pl } },
  lng: detect(),
  fallbackLng: "en",
  interpolation: { escapeValue: false }
})

document.documentElement.lang = i18n.language

export const setLanguage = (language: LanguageId) => {
  i18n.changeLanguage(language)
  document.documentElement.lang = language
  try {
    localStorage.setItem(STORAGE_KEY, language)
  } catch {
    // preference is optional
  }
}

export const currentLanguage = (): LanguageId => (isSupported(i18n.language) ? i18n.language : "en")

export default i18n

const sentence = (value: string) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()

// Library vocabulary (category, complexity, equipment) shown in the user's language
export const enumLabel = (kind: "category" | "complexity" | "equipment", value?: string | null) =>
  value ? i18n.t(`enum.${kind}.${value.toLowerCase()}`, { defaultValue: sentence(value) }) : ""

// "Chest, triceps" -> localised, per muscle
export const muscleLabel = (text?: string | null) =>
  (text ?? "")
    .split(",")
    .map(part => part.trim())
    .filter(Boolean)
    .map(part => i18n.t(`enum.muscle.${part.toLowerCase().replace(/\s+/g, "_")}`, { defaultValue: part }))
    .join(", ")
