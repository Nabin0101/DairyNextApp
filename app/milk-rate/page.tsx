"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Plus, Pencil, Trash2, Search, Filter, ChevronsUpDown, ArrowUp, ArrowDown, X, ChevronLeft, ChevronRight,SortAscIcon } from "lucide-react"
import { fetchMilkRates, updateMilkRate, deleteMilkRate } from "@/services/milkrate/milkRateService"
import { toast } from "react-toastify"

const columns = [
  { id: "id", label: "ID", sortable: false, filterable: false },
  { id: "fatContent", label: "Fat %", sortable: true, filterable: true },
  { id: "milkType", label: "Milk Type", sortable: true, filterable: true },
  { id: "ratePerLiter", label: "Rate (Rs)", sortable: true, filterable: true },
  { id: "actions", label: "Actions", sortable: false, filterable: false }
];

const milkTypeLabels: Record<number, string> = {
  0: "Cow",
  1: "Buffalo",
  2: "Mixed",
};

export default function MilkRatePage() {
  // Table state
  const [searchTerm, setSearchTerm] = useState("")
  const [milkRates, setMilkRates] = useState<any[]>([])
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({})
  const [sortField, setSortField] = useState<string>("")
  const [sortDirection, setSortDirection] = useState<"" | "asc" | "desc">("")
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [filterPopoverOpen, setFilterPopoverOpen] = useState<Record<string, boolean>>({})
  const [tempFilterValue, setTempFilterValue] = useState<Record<string, string>>({})
  const [searchInput, setSearchInput] = useState(""); 
  // Modal state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentRate, setCurrentRate] = useState<any>(null)
  const [formData, setFormData] = useState({
    fatContent: "",
    milkType: "",
    ratePerLiter: "",
  })
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Build filter string for API
  const buildFilterString = (filters: Record<string, string>): string => {
    return Object.entries(filters)
      .filter(([_, val]) => val.trim() !== "")
      .map(([key, val]) => `${key}@=${val}`)
      .join(",");
  };

  // Build sort string for API
  const buildSortString = () => {
    if (!sortField) return "";
    return sortDirection === "desc" ? `-${sortField}` : sortField;
  };

  // Table handlers
  const handleSort = (field: string, direction: "asc" | "desc") => {
    if (sortField === field && sortDirection === direction) {
      setSortField("");
      setSortDirection("");
    } else {
      setSortField(field);
      setSortDirection(direction);
    }
    setPageNumber(1);
  };

  const openFilterPopover = (columnId: string, currentValue: string) => {
    setFilterPopoverOpen(prev => ({ ...prev, [columnId]: true }));
    setTempFilterValue(prev => ({ ...prev, [columnId]: currentValue }));
  };

  const applyFilter = (columnId: string) => {
    setColumnFilters(prev => ({ ...prev, [columnId]: tempFilterValue[columnId] || "" }));
    setFilterPopoverOpen(prev => ({ ...prev, [columnId]: false }));
    setPageNumber(1);
  };

  const clearFilter = (columnId: string) => {
    setTempFilterValue(prev => ({ ...prev, [columnId]: "" }));
    setColumnFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[columnId];
      return newFilters;
    });
    setPageNumber(1);
  };

  const clearAllFilters = () => {
    setColumnFilters({});
    setTempFilterValue({});
    setPageNumber(1);
  };

  // Data loading
  const loadRates = async () => {
    setLoading(true)
    try {
      const payload: any = {
        query: searchTerm ? `(fatContent|ratePerLiter)@=${searchTerm}` : undefined,
        filters: buildFilterString(columnFilters),
        sorts: buildSortString(),
        pageNumber,
        pageSize
      }
      const data = await fetchMilkRates(payload)
      setMilkRates(Array.isArray(data.milkRates) ? data.milkRates : []);
      setTotalCount(data.pagination?.total || 0)
    } catch (error) {
      console.log("Failed to fetch milk rate.",error);
      setMilkRates([])
    } finally {
      setLoading(false)
    }
  }

  // Pagination
  const totalPages = Math.ceil(totalCount / pageSize);
  const startItem = (pageNumber - 1) * pageSize + 1;
  const endItem = Math.min(pageNumber * pageSize, totalCount);

  const hasActiveFilters = Object.values(columnFilters).some(val => val.trim() !== "") || searchTerm.trim() !== "";

  useEffect(() => {
    loadRates()
  }, [searchTerm, columnFilters, sortField, sortDirection, pageNumber, pageSize])

  // Edit dialog logic
  const openEditDialog = (rate: any) => {
    setCurrentRate(rate)
    setFormData({
      fatContent: rate.fatContent.toString(),
      milkType: rate.milkType.toString(),
      ratePerLiter: rate.ratePerLiter.toString(),
    })
    setIsEditDialogOpen(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEditLoading(true)
    try {
      await updateMilkRate({
        id: currentRate.id,
        milkType: Number(formData.milkType),
        ratePerLiter: Number(formData.ratePerLiter),
        fatContent: Number(formData.fatContent),
      })
      setIsEditDialogOpen(false)
      loadRates()
      toast.success("Milk rate updated successfully!")
    } catch (err) {
      toast.error("Failed to update milk rate.")
    } finally {
      setEditLoading(false)
    }
  }

  // Delete dialog logic
  const openDeleteDialog = (rate: any) => {
    setCurrentRate(rate)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!currentRate) return;
    setDeleteLoading(true)
    try {
      await deleteMilkRate(currentRate.id)
      setIsDeleteDialogOpen(false)
     loadRates()
      toast.success("Milk rate deleted successfully!")
    } catch (err) {
      toast.error("Failed to delete milk rate.")
    } finally {
      setDeleteLoading(false)
    }
  }


  return (
    <div className="space-y-4">
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

      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">Milk Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
            <div className="flex items-center w-full max-w-sm gap-0">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search milk rates..."
                className="pl-8 pr-2 py-2 w-full max-w-[160px]"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSearchTerm(searchInput);
                    setPageNumber(1);
                  }
                }}
              />
              </div>
               <Button
               className="!ml-1"
                onClick={() => {
                  setSearchTerm(searchInput);
                  setPageNumber(1);
                }}
              >
                Search
              </Button>
            </div>
            <div className="flex gap-2">
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearAllFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column.id} className="whitespace-nowrap">
                      <div className="flex items-center justify-between">
                        <span>{column.label}</span>
                        <div className="flex gap-1">
                          {column.sortable && (
                            <div className="flex flex-col">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 p-0"
                                onClick={() => {
                                  if(sortField!== column.id) {
                                  setSortField(column.id);
                                  setSortDirection("asc");
                                } else if (sortDirection === "asc") {
                                  setSortDirection("desc");
                                } else if (sortDirection === "desc") {
                                  setSortDirection("asc");
                                }
                                setPageNumber(1);
                              }}
                              >
                                {sortField !== column.id ? (
                                  <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                                ) : sortDirection === "asc" ? (
                                  <ArrowUp className="h-4 w-4 text-blue-500" />
                                ) : (
                                  <ArrowDown className="h-4 w-4 text-blue-500" />
                                )}
                              </Button>
                            </div>
                          )}
                          {column.filterable && (
                            <Popover
                              open={filterPopoverOpen[column.id] || false}
                              onOpenChange={(open) => setFilterPopoverOpen(prev => ({ ...prev, [column.id]: open }))}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 relative"
                                  onClick={() => openFilterPopover(column.id, columnFilters[column.id] || "")}
                                >
                                  <Filter className={`h-3 w-3 ${columnFilters[column.id] ? "text-blue-500" : ""}`} />
                                  {columnFilters[column.id] && (
                                    <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full"></span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-60 p-3" align="end">
                                <div className="space-y-4">
                                  <h4 className="font-medium leading-none">Filter {column.label}</h4>
                                  {column.id === "milkType" ? (
                                    <select
                                      value={tempFilterValue[column.id] || ""}
                                      onChange={(e) => setTempFilterValue(prev => ({ ...prev, [column.id]: e.target.value }))}
                                      className="w-full border rounded px-2 py-1"
                                    >
                                      <option value="">All</option>
                                      <option value="0">Cow</option>
                                      <option value="1">Buffalo</option>
                                      <option value="2">Mixed</option>
                                    </select>
                                  ) : (
                                    <Input
                                      value={tempFilterValue[column.id] || ""}
                                      onChange={(e) => setTempFilterValue(prev => ({ ...prev, [column.id]: e.target.value }))}
                                      placeholder={`Filter by ${column.label}`}
                                    />
                                  )}
                                  <div className="flex justify-between">
                                    {columnFilters[column.id] && (
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => clearFilter(column.id)}
                                      >
                                        Clear
                                      </Button>
                                    )}
                                    <div className="flex justify-end gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setFilterPopoverOpen(prev => ({ ...prev, [column.id]: false }));
                                        }}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        size="sm"
                                        onClick={() => applyFilter(column.id)}
                                      >
                                        Apply
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          )}
                        </div>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : milkRates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center">No rates found.</TableCell>
                  </TableRow>
                ) : (
                  milkRates.map((rate, index) => (
                    <TableRow key={rate.id}>
                      <TableCell>{startItem + index}</TableCell>
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

      
      
    </div>
  )
}
