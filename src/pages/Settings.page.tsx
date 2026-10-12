import { Page } from "@root/components/__shared/layout/Page"
import { PageHeader } from "@root/components/__shared/PageHeader"
import { PALETTES, PALETTE_IDS, swatch, type PaletteId } from "@root/theme/palettes"
import { setThemePrefs, useThemePrefs, type Density, type MotionPref, type TextSize, type ThemeModePref } from "@root/theme/themeStore"
import type { ThemeStyle } from "@root/theme/buildTheme"
import styled from "styled-components"
import { useTranslation } from "react-i18next"
import { LANGUAGES, setLanguage } from "@root/i18n"
import { useAppDispatch } from "@root/store/hooks/store"
import { getAllExercisesAction } from "@root/store/slices/exercises/exercises.thunks"

const MODES: { id: ThemeModePref; label: string }[] = [
  { id: "system", label: "settings.system" },
  { id: "light", label: "settings.light" },
  { id: "dark", label: "settings.dark" }
]

const STYLES: { id: ThemeStyle; label: string; hint: string }[] = [
  { id: "vivid", label: "settings.vivid", hint: "settings.vividHint" },
  { id: "flat", label: "settings.flat", hint: "settings.flatHint" }
]

const TEXT_SIZES: { id: TextSize; label: string }[] = [
  { id: "small", label: "settings.sizeSmall" },
  { id: "default", label: "settings.sizeDefault" },
  { id: "large", label: "settings.sizeLarge" },
  { id: "xlarge", label: "settings.sizeXLarge" }
]

const DENSITIES: { id: Density; label: string }[] = [
  { id: "compact", label: "settings.compact" },
  { id: "comfortable", label: "settings.comfortable" },
  { id: "spacious", label: "settings.spacious" }
]

const MOTIONS: { id: MotionPref; label: string }[] = [
  { id: "system", label: "settings.system" },
  { id: "reduced", label: "settings.reduced" },
  { id: "full", label: "settings.full" }
]

const SettingsPage = () => {
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const prefs = useThemePrefs()

  return (
    <Page headerComponent={<PageHeader title={t("settings.title")} />}>
      <Root>
        <Section>
          <h3>{t("settings.appearance")}</h3>

          <Label>{t("settings.mode")}</Label>
          <Segmented>
            {MODES.map(mode => (
              <button
                key={mode.id}
                type="button"
                aria-pressed={prefs.mode === mode.id}
                onClick={() => setThemePrefs({ mode: mode.id })}
              >
                {t(mode.label)}
              </button>
            ))}
          </Segmented>

          <Label>{t("settings.style")}</Label>
          <Segmented>
            {STYLES.map(style => (
              <button
                key={style.id}
                type="button"
                aria-pressed={prefs.style === style.id}
                onClick={() => setThemePrefs({ style: style.id })}
              >
                {t(style.label)}
              </button>
            ))}
          </Segmented>
          <Hint>{t(STYLES.find(style => style.id === prefs.style)?.hint ?? "")}</Hint>

          <Label>{t("settings.colour")}</Label>
          <Palettes>
            {PALETTE_IDS.map((id: PaletteId) => {
              const palette = PALETTES[id]
              return (
                <PaletteButton
                  key={id}
                  type="button"
                  aria-pressed={prefs.palette === id}
                  onClick={() => setThemePrefs({ palette: id })}
                >
                  <Swatch style={{ background: swatch(palette) }} />
                  <strong>{palette.name}</strong>
                  <small>{palette.tagline}</small>
                </PaletteButton>
              )
            })}
          </Palettes>
        </Section>

        <Section>
          <h3>{t("settings.display")}</h3>

          <Label>{t("settings.textSize")}</Label>
          <Segmented>
            {TEXT_SIZES.map(size => (
              <button
                key={size.id}
                type="button"
                aria-pressed={prefs.textSize === size.id}
                onClick={() => setThemePrefs({ textSize: size.id })}
              >
                {t(size.label)}
              </button>
            ))}
          </Segmented>

          <Label>{t("settings.spacing")}</Label>
          <Segmented>
            {DENSITIES.map(density => (
              <button
                key={density.id}
                type="button"
                aria-pressed={prefs.density === density.id}
                onClick={() => setThemePrefs({ density: density.id })}
              >
                {t(density.label)}
              </button>
            ))}
          </Segmented>

          <Label>{t("settings.animations")}</Label>
          <Segmented>
            {MOTIONS.map(motion => (
              <button
                key={motion.id}
                type="button"
                aria-pressed={prefs.motion === motion.id}
                onClick={() => setThemePrefs({ motion: motion.id })}
              >
                {t(motion.label)}
              </button>
            ))}
          </Segmented>
        </Section>

        <Section>
          <h3>{t("settings.language")}</h3>
          <Segmented>
            {LANGUAGES.map(language => (
              <button
                key={language.id}
                type="button"
                aria-pressed={i18n.language === language.id}
                onClick={() => {
                  setLanguage(language.id)
                  dispatch(getAllExercisesAction())
                }}
              >
                {language.label}
              </button>
            ))}
          </Segmented>
        </Section>
      </Root>
    </Page>
  )
}

export default SettingsPage

const Root = styled.div`
  padding: 1rem 1.25rem 2rem;
`

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1.1rem;
  border: 1px solid var(--card-border);
  border-radius: var(--radius-card);
  background: var(--surface);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  box-shadow: var(--card-shadow);

  h3 {
    font-size: 1.1rem;
  }
`

const Label = styled.div`
  margin-top: 0.4rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-3);
`

const Hint = styled.small`
  color: var(--text-3);
`

const Segmented = styled.div`
  display: flex;
  gap: 0.35rem;
  padding: 0.25rem;
  border-radius: var(--radius-control);
  background: var(--pill-bg);

  button {
    flex: 1;
    padding: 0.5rem 0.25rem;
    border: none;
    border-radius: 4px;
    background: transparent;
    color: var(--text-2);
    font-size: 0.9rem;
    cursor: pointer;
  }

  button[aria-pressed="true"] {
    background: var(--accent);
    color: var(--accent-contrast);
  }
`

const Palettes = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;
`

const Swatch = styled.span`
  width: 100%;
  height: 2.6rem;
  border-radius: 4px;
`

const PaletteButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.2rem;
  padding: 0.6rem;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-card);
  background: transparent;
  color: var(--text-1);
  text-align: left;
  cursor: pointer;

  small {
    color: var(--text-3);
    font-size: 0.7rem;
  }

  &[aria-pressed="true"] {
    border-color: var(--accent);
  }
`
