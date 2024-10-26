import { Button } from "@root/components/__shared/Button"
import { Page } from "@root/components/__shared/layout/Page"
import { useNavigate } from "react-router-dom"

const routineId = 1 // mock

const Home = () => {
  const navigate = useNavigate()

  const handleNavigate = () => {
    navigate(`/routines/${routineId}`)
  }

  // init flow = call API => ID back => navigate to routine/:id

  return (
    <Page headerComponent={<h4>Routine Tracker</h4>} footerComponent={<div>Footer</div>}>
      <Button onClick={handleNavigate}>Routine 1</Button>
    </Page>
  )
}

export default Home
