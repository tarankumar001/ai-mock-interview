import { Button } from "@/components/ui/button"
import { Headings } from "@/components/ui/headings"
import { Link } from "react-router-dom"
import { Plus } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export const Dashboard = () => {
  return <>
  <div className="flex w-full items-center justify-between">
    
    
    {/* heading */}
    <Headings title="Dashboard" description="Create and start your AI Mock Interview" />

    <Link to={"/generate/create"}>
    <Button size={"sm"}>
      <Plus/>Add New
    </Button>
    
    
    </Link>
    
    </div>    
    <Separator className="my-8" />


  </>
    

}
