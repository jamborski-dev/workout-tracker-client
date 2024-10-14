import { FixMeLater } from "@root/types/FixMeLater"
import { RefObject, useEffect } from "react"

type KeyHandler = {
  key: string
  handler: (event: KeyboardEvent) => void
}

function useKeyboard(
  ref: RefObject<HTMLElement>,
  keyHandlers: KeyHandler[],
  deps: FixMeLater[] = []
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      keyHandlers.forEach(({ key, handler }) => {
        if (event.key === key) {
          handler(event)
        }
      })
    }

    const element = ref.current || document

    element.addEventListener("keydown", event => handleKeyDown(event as KeyboardEvent))

    return () => {
      element.removeEventListener("keydown", event => handleKeyDown(event as KeyboardEvent))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, ...deps, keyHandlers])
}

export default useKeyboard
