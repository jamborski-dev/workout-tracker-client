import { NoAuthPage } from "@root/templates/NoAuthPage"
import { useRouteError } from "react-router-dom"

interface RouteError {
  statusText: string
  message: string
}
export default function ErrorPage() {
  const error = useRouteError()
  console.error(error)

  return (
    <NoAuthPage>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{(error as RouteError).statusText || (error as RouteError).message}</i>
      </p>
    </NoAuthPage>
  )
}
