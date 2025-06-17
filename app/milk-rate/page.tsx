"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Pencil, Trash2, Search } from "lucide-react"

// Mock data for milk rates
const mockRates = [
  { id: 1, fatPercentage: 3.5, snfPercentage: 8.0, rate: 40 },
  { id: 2, fatPercentage: 4.0, snfPercentage: 8.5, rate: 45 },
  { id: 3, fatPercentage: 4.5, snfPercentage: 9.0, rate: 50 },
  { id: 4, fatPercentage: 5.0, snfPercentage: 9.5, rate: 55 },
  { id: 5, fatPercentage: 5.5, snfPercentage: 10.0, rate: 60 },
]

export default function MilkRatePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentRate, setCurrentRate] = useState<any>(null)
  const [formData, setFormData] = useState({
    fatPercentage: "",
    snfPercentage: "",
    rate: "",
  })

  const filteredRates = mockRates.filter(
    (rate) =>
      rate.fatPercentage.toString().includes(searchTerm) ||
      rate.snfPercentage.toString().includes(searchTerm) ||
      rate.rate.toString().includes(searchTerm),
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your API
    console.log("Add form submitted:", formData)
    setIsAddDialogOpen(false)
    setFormData({
      fatPercentage: "",
      snfPercentage: "",
      rate: "",
    })
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your API
    console.log("Edit form submitted:", { id: currentRate.id, ...formData })
    setIsEditDialogOpen(false)
    setCurrentRate(null)
    setFormData({
      fatPercentage: "",
      snfPercentage: "",
      rate: "",
    })
  }

  const handleDeleteConfirm = () => {
    // Here you would typically send the delete request to your API
    console.log("Delete confirmed for ID:", currentRate.id)
    setIsDeleteDialogOpen(false)
    setCurrentRate(null)
  }

  const openEditDialog = (rate: any) => {
    setCurrentRate(rate)
    setFormData({
      fatPercentage: rate.fatPercentage.toString(),
      snfPercentage: rate.snfPercentage.toString(),
      rate: rate.rate.toString(),
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (rate: any) => {
    setCurrentRate(rate)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">Milk Rates</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#17a2b8] hover:bg-[#138496]">
                <Plus className="mr-2 h-4 w-4" />
                Add Rate
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Milk Rate</DialogTitle>
                <DialogDescription>Enter the details for the new milk rate.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="fatPercentage" className="text-right">
                      Fat %
                    </Label>
                    <Input
                      id="fatPercentage"
                      name="fatPercentage"
                      type="number"
                      step="0.1"
                      value={formData.fatPercentage}
                      onChange={handleChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="snfPercentage" className="text-right">
                      SNF %
                    </Label>
                    <Input
                      id="snfPercentage"
                      name="snfPercentage"
                      type="number"
                      step="0.1"
                      value={formData.snfPercentage}
                      onChange={handleChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="rate" className="text-right">
                      Rate (Rs)
                    </Label>
                    <Input
                      id="rate"
                      name="rate"
                      type="number"
                      value={formData.rate}
                      onChange={handleChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-[#17a2b8] hover:bg-[#138496]">
                    Save
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search rates..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Fat %</TableHead>
                  <TableHead>SNF %</TableHead>
                  <TableHead>Rate (Rs)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRates.map((rate) => (
                  <TableRow key={rate.id}>
                    <TableCell>{rate.id}</TableCell>
                    <TableCell>{rate.fatPercentage}</TableCell>
                    <TableCell>{rate.snfPercentage}</TableCell>
                    <TableCell>{rate.rate}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(rate)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500"
                          onClick={() => openDeleteDialog(rate)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Milk Rate</DialogTitle>
            <DialogDescription>Update the details for this milk rate.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-fatPercentage" className="text-right">
                  Fat %
                </Label>
                <Input
                  id="edit-fatPercentage"
                  name="fatPercentage"
                  type="number"
                  step="0.1"
                  value={formData.fatPercentage}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-snfPercentage" className="text-right">
                  SNF %
                </Label>
                <Input
                  id="edit-snfPercentage"
                  name="snfPercentage"
                  type="number"
                  step="0.1"
                  value={formData.snfPercentage}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-rate" className="text-right">
                  Rate (Rs)
                </Label>
                <Input
                  id="edit-rate"
                  name="rate"
                  type="number"
                  value={formData.rate}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-[#17a2b8] hover:bg-[#138496]">
                Update
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this milk rate? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
