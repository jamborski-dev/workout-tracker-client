import { Page } from "@root/components/__shared/layout/Page"
import { PageHeader } from "@root/components/__shared/PageHeader"
import { PALETTES, PALETTE_IDS, swatch, type PaletteId } from "@root/theme/palettes"
import { setThemePrefs, useThemePrefs, type ThemeModePref } from "@root/theme/themeStore"
import type { ThemeStyle } from "@root/theme/buildTheme"
import styled from "styled-components"

const MODES: { id: ThemeModePref; label: string }[] = [
  { id: "system", label: "System" },
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" }
]

const STYLES: { id: ThemeStyle; label: string; hint: string }[] = [
  { id: "vivid", label: "Vivid", hint: "Soft backdrop, translucent surfaces" },
  { id: "flat", label: "Flat", hint: "Solid surfaces, no effects" }
]

const SettingsPage = () => {
  const prefs = useThemePrefs()

  return (
    <Page headerComponent={<PageHeader title="Settings" />}>
      <Root>
        <Section>
          <h3>Appearance</h3>

          <Label>Mode</Label>
          <Segmented>
            {MODES.map(mode => (
              <button
                key={mode.id}
                type="button"
                aria-pressed={prefs.mode === mode.id}
                onClick={() => setThemePrefs({ mode: mode.id })}
              >
                {mode.label}
              </button>
            ))}
          </Segmented>

          <Label>Style</Label>
          <Segmented>
            {STYLES.map(style => (
              <button
                key={style.id}
                type="button"
                aria-pressed={prefs.style === style.id}
                onClick={() => setThemePrefs({ style: style.id })}
              >
                {style.label}
              </button>
            ))}
          </Segmented>
          <Hint>{STYLES.find(style => style.id === prefs.style)?.hint}</Hint>

          <Label>Colour</Label>
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
