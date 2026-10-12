import { NoAuthPage } from "@root/templates/NoAuthPage"
import { useRouteError } from "react-router-dom"
import { useTranslation } from "react-i18next"

interface RouteError {
  statusText: string
  message: string
}
export default function ErrorPage() {
  const { t } = useTranslation()
  const error = useRouteError()
  console.error(error)

  return (
    <NoAuthPage>
      <h1>{t("error.oopsShort")}</h1>
      <p>{t("error.sorry")}</p>
      <p>
        <i>{(error as RouteError).statusText || (error as RouteError).message}</i>
      </p>
    </NoAuthPage>
  )
}
