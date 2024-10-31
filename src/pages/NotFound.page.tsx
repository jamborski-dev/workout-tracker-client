import { NoAuthPage } from "@root/templates/NoAuthPage"
import { Link } from "react-router-dom"

export const NotFound = () => {
  return (
    <NoAuthPage>
      <h1>404 - Not Found</h1>
      <Link to="/">
        <button>Go Back</button>
      </Link>
    </NoAuthPage>
  )
}
