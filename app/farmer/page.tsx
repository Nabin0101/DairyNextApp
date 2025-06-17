"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, Filter, MoreHorizontal, FileDown, Printer } from "lucide-react"
import Link from "next/link"
import { fetchFarmers } from "@/services/farmerService"

export default function FarmerPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [farmers, setFarmers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFarmers = async () => {
      setLoading(true)
      try {
        const data = await fetchFarmers({ query: searchTerm })
        setFarmers(Array.isArray(data.farmers) ? data.farmers : [])
      } catch (error) {
        console.error("Failed to fetch farmers:", error)
        setFarmers([])
      } finally {
        setLoading(false)
      }
    }

    loadFarmers()
  }, [searchTerm]) // re-fetch on searchTerm change

  return (
    <div className="space-y-4">
      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">Farmers</CardTitle>
          <Link href="/farmer/create">
            <Button className="bg-[#17a2b8] hover:bg-[#138496]">
              <Plus className="mr-2 h-4 w-4" />
              Add Farmer
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search farmers..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon"><FileDown className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon"><Printer className="h-4 w-4" /></Button>
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S.N</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6}>Loading...</TableCell>
                  </TableRow>
                ) : farmers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6}>No farmers found.</TableCell>
                  </TableRow>
                ) : (
                  farmers.map((farmer,index) => (
                    <TableRow key={farmer.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{farmer.fullName}</TableCell>
                      <TableCell>{farmer.phoneNumber}</TableCell>
                      <TableCell>{farmer.address}</TableCell>
                      <TableCell>{farmer.email}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Link href={`/farmer/edit/${farmer.id}`} className="w-full">
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
