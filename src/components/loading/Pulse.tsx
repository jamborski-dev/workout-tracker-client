import { useState, useEffect } from "react"
import type { SVGProps } from "react"

export function Pulse(props: SVGProps<SVGSVGElement> & { play?: boolean }) {
  const { play, ...rest } = props
  const [shouldPlay, setShouldPlay] = useState(play)

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (play) {
      setShouldPlay(true)
    } else {
      timeout = setTimeout(() => setShouldPlay(false), 1200) // Duration of the animation
    }
    return () => clearTimeout(timeout)
  }, [play])

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...rest}>
      <circle cx={12} cy={12} r={0} fill="currentColor">
        {shouldPlay && (
          <>
            <animate
              attributeName="r"
              calcMode="spline"
              dur="1.2s"
              keySplines=".52,.6,.25,.99"
              repeatCount="indefinite"
              values="0;11"
            />
            <animate
              attributeName="opacity"
              calcMode="spline"
              dur="1.2s"
              keySplines=".52,.6,.25,.99"
              repeatCount="indefinite"
              values="1;0"
            />
          </>
        )}
      </circle>
    </svg>
  )
}
