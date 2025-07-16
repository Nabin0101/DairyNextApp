"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { fetchMilkRates, MilkRate, Pagination, updateMilkRate, deleteMilkRate } from "@/services/milkrate/milkRateService"

export default function MilkRatePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentRate, setCurrentRate] = useState<any>(null)
  const [formData, setFormData] = useState({
    fatContent: "",
    milkType: "",
    ratePerLiter: "",
  })
  const [milkRates, setMilkRates] = useState<MilkRate[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadRates = async () => {
      setLoading(true)
      try {
        const res = await fetchMilkRates({ pageNumber, pageSize, query: searchTerm })
        setMilkRates(res.milkRates)
        setPagination(res.pagination)
      } catch (e) {
        setMilkRates([])
        setPagination(null)
      } finally {
        setLoading(false)
      }
    }
    loadRates()
  }, [pageNumber, pageSize, searchTerm])

  const filteredRates = milkRates // Now using API data, not mockRates

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateMilkRate({
        id: currentRate.id,
        milkType: Number(formData.milkType),
        ratePerLiter: Number(formData.ratePerLiter),
        fatContent: Number(formData.fatContent),
      })
      setIsEditDialogOpen(false)
      setCurrentRate(null)
      setFormData({ fatContent: "", milkType: "", ratePerLiter: "" })
      // Reload data
      const res = await fetchMilkRates({ pageNumber, pageSize, query: searchTerm })
      setMilkRates(res.milkRates)
      setPagination(res.pagination)
      // Optionally show a toast here
    } catch (err) {
      // Optionally show a toast here
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteConfirm = async () => {
    setLoading(true)
    try {
      await deleteMilkRate(currentRate.id)
      setIsDeleteDialogOpen(false)
      setCurrentRate(null)
      // Reload data
      const res = await fetchMilkRates({ pageNumber, pageSize, query: searchTerm })
      setMilkRates(res.milkRates)
      setPagination(res.pagination)
      // Optionally show a toast here
    } catch (err) {
      // Optionally show a toast here
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const openEditDialog = (rate: any) => {
    setCurrentRate(rate)
    setFormData({
      fatContent: rate.fatContent.toString(),
      milkType: rate.milkType.toString(),
      ratePerLiter: rate.ratePerLiter.toString(),
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (rate: any) => {
    setCurrentRate(rate)
    setIsDeleteDialogOpen(true)
  }

  const milkTypeLabels: Record<number, string> = {
    0: "Cow",
    1: "Buffalo",
    2: "Mixed",
  };

  const totalCount = pagination?.total || 0
  const totalPages = pagination?.totalPage || 1
  const startItem = totalCount === 0 ? 0 : (pageNumber - 1) * pageSize + 1
  const endItem = Math.min(pageNumber * pageSize, totalCount)

  return (
    <div className="space-y-4">
      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">Milk Rates</CardTitle>
          {/* Removed Add Rate button */}
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
                  <TableHead>Milk Type</TableHead>
                  <TableHead>Rate (Rs)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : filteredRates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">No rates found.</TableCell>
                  </TableRow>
                ) : (
                  filteredRates.map((rate) => (
                    <TableRow key={rate.id}>
                      <TableCell>{rate.id}</TableCell>
                      <TableCell>{rate.fatContent}</TableCell>
                      <TableCell>{milkTypeLabels[rate.milkType] ?? rate.milkType}</TableCell>
                      <TableCell>{rate.ratePerLiter}</TableCell>
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
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {/* Pagination Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between mt-4 gap-4">
            <div className="text-sm text-muted-foreground">
              Showing {startItem} to {endItem} of {totalCount} entries
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm">
                <span>Rows per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPageNumber(1);
                  }}
                  className="border rounded px-2 py-1"
                >
                  {[10, 20, 50, 100].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                  disabled={pageNumber === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {/* First page */}
                {pageNumber > 3 && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setPageNumber(1)}
                  >
                    1
                  </Button>
                )}
                {/* Ellipsis */}
                {pageNumber > 4 && (
                  <span className="px-1">...</span>
                )}
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else {
                    const start = Math.max(1, Math.min(pageNumber - 2, totalPages - 4));
                    pageNum = start + i;
                  }
                  return (
                    pageNum <= totalPages && (
                      <Button
                        key={pageNum}
                        variant={pageNumber === pageNum ? "default" : "outline"}
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setPageNumber(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    )
                  );
                })}
                {/* Ellipsis */}
                {pageNumber < totalPages - 3 && (
                  <span className="px-1">...</span>
                )}
                {/* Last page */}
                {pageNumber < totalPages - 2 && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setPageNumber(totalPages)}
                  >
                    {totalPages}
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setPageNumber(prev => Math.min(prev + 1, totalPages))}
                  disabled={pageNumber === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
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
                <Label htmlFor="edit-fatContent" className="text-right">
                  Fat Content
                </Label>
                <Input
                  id="edit-fatContent"
                  name="fatContent"
                  type="number"
                  step="0.1"
                  value={formData.fatContent}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-milkType" className="text-right">
                  Milk Type
                </Label>
                <select
                  id="edit-milkType"
                  name="milkType"
                  value={formData.milkType}
                  onChange={handleChange}
                  className="col-span-3 border rounded px-2 py-1"
                  required
                >
                  <option value="0">Cow</option>
                  <option value="1">Buffalo</option>
                  <option value="2">Mixed</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-ratePerLiter" className="text-right">
                  Rate (Rs)
                </Label>
                <Input
                  id="edit-ratePerLiter"
                  name="ratePerLiter"
                  type="number"
                  value={formData.ratePerLiter}
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
