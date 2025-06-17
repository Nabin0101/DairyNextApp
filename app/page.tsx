import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Droplet, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Farmers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[#17a2b8]">11</div>
          <p className="text-xs text-muted-foreground">Total registered farmers</p>
        </CardContent>
      </Card>
      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Milk Collection</CardTitle>
          <Droplet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[#17a2b8]">10</div>
          <p className="text-xs text-muted-foreground">Today's collections</p>
        </CardContent>
      </Card>
      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Spending</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[#17a2b8]">Rs 3249</div>
          <p className="text-xs text-muted-foreground">Current month expenses</p>
        </CardContent>
      </Card>
    </div>
  )
}
