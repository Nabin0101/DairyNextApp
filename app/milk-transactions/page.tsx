"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, Filter, MoreHorizontal, FileDown, Upload, Download, X, Printer, ChevronsUpDown, ArrowUp, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { fetchMilkTransactions, getMilkTransactionById, updateMilkTransaction, deleteMilkTransaction } from "@/services/milktransaction/milkTransaction"
import { toast } from "react-toastify"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";


const columns = [
  { id: "sn", label: "S.N", sortable: false, filterable: false },
  { id: "farmerName", label: "Name", sortable: true, filterable: true },
  { id: "shift", label: "Shift", sortable: true, filterable: true },
  { id: "transactionDate", label: "TransactionDate", sortable: true, filterable: true },
  { id: "quantity", label: "Quantity", sortable: true, filterable: true },
  { id: "actions", label: "Actions", sortable: false, filterable: false }
];
const shiftLables: Record<number, string> = {
  0: "Morning",
  1: "Evening",
};

const milkTypeLables: Record<number, string> = {
  0: "Cow",
  1: "Buffalo",
  2: "Mixed"
};

export default function MilkTransactionsPage() {
  // Table state
  const [searchTerm, setSearchTerm] = useState("");
  const [milktransactions, setMilkTransactions] = useState<any[]>([]);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"" | "asc" | "desc">("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterPopoverOpen, setFilterPopoverOpen] = useState<Record<string, boolean>>({});
  const [tempFilterValue, setTempFilterValue] = useState<Record<string, string>>({});
  const [searchInput, setSearchInput] = useState("");

  // Modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMilkTransaction, setSelectedMilkTransaction] = useState<any>(null);
  const [editForm, setEditForm] = useState({ id: "", farmerName: "", shift: "", transactionDate: "", quantity: "", milkType :"",fatContent:"" });
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
  const loadMilkTransactions = async () => {
    setLoading(true);
    try {
      const payload = {
        query: searchTerm ? `(fullName|transactionDate|shift|quantity)@=${searchTerm}` : undefined,
        filters: buildFilterString(columnFilters),
        sorts: buildSortString(),
        pageNumber,
        pageSize
      };
      const data = await fetchMilkTransactions(payload);
      setMilkTransactions(Array.isArray(data.milkTransactions) ? data.milkTransactions : []);
      setTotalCount(data.pagination?.total || 0);
    } catch (error) {
      console.error("Failed to fetch milk transactions:", error);
      setMilkTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMilkTransactions();
  }, [searchTerm, columnFilters, sortField, sortDirection, pageNumber, pageSize]);

  // Pagination
  const totalPages = Math.ceil(totalCount / pageSize);
  const startItem = (pageNumber - 1) * pageSize + 1;
  const endItem = Math.min(pageNumber * pageSize, totalCount);

  const hasActiveFilters = Object.values(columnFilters).some(val => val.trim() !== "") || searchTerm.trim() !== "";

  // Edit Modal Handlers
  const openEditModal = (milkTransaction: any) => {
    setSelectedMilkTransaction(milkTransaction);
    setEditForm({
      id: milkTransaction.id ?? "",
      farmerName: milkTransaction.farmerName ?? "",
      shift: String(milkTransaction.shift ?? ""),
      transactionDate: milkTransaction.transactionDate.split("T")[0] ?? "",
      quantity: milkTransaction.quantity ?? "",
      milkType : String(milkTransaction.milkType ?? ""),
      fatContent: String(milkTransaction.fatContent ?? "")
    });
    setEditModalOpen(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      await updateMilkTransaction(editForm);
      toast.success("Farmer updated successfully!")
      setEditModalOpen(false);
      loadMilkTransactions();
    } catch (err) {
      alert("Failed to update milk transactions.");
    } finally {
      setEditLoading(false);
    }
  };

  // View Modal Handler
  const openViewModal = async (milkTransaction: any) => {
    setViewModalOpen(true);
    setSelectedMilkTransaction(null);
    try {
      const details = await getMilkTransactionById(milkTransaction.id);
      setSelectedMilkTransaction(details);
    } catch (error) {
      // handle error, e.g. show a toast
      setViewModalOpen(false);
    }
  };

  // Delete Handler
  const openDeleteDialog = (farmer: any) => {
    setSelectedMilkTransaction(farmer);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedMilkTransaction) return;
    setDeleteLoading(true);
    try {
      await deleteMilkTransaction(selectedMilkTransaction.id);
      setDeleteDialogOpen(false);
      loadMilkTransactions();
      toast.success("Milk Transaction deleted successfully!")
    } catch (err) {
      alert("Failed to delete milk transacation.");
    } finally {
      setDeleteLoading(false);
    }
  };
  return (
    <div className="space-y-4">
      {/* Edit Farmer Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Milk Transaction</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <Label htmlFor="farmeName">Full Name</Label>
              <Input
                id="farmerName"
                name="farmerName"
                value={editForm.farmerName}
                onChange={handleEditChange}
                placeholder="Full Name"
                required
              />
            </div>
            <div>
              <Label htmlFor="shift">Shift</Label>
                <Select name="shift" value={editForm.shift} onValueChange={(value) => setEditForm({ ...editForm, shift: value })}>
                  <SelectTrigger id="shift">
                    <SelectValue placeholder="Select Shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Morning</SelectItem>
                    <SelectItem value="2">Evening</SelectItem>
                  </SelectContent>
                </Select>
            </div>
            <div>
              <Label htmlFor="email">Transaction Date</Label>
              <Input
                id="transactionDate"
                name="transactionDate"
                type="date"
                value={editForm.transactionDate}
                onChange={handleEditChange}
                placeholder="Transaction Date"
                required
              />
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={editForm.quantity}
                onChange={handleEditChange}
                placeholder="Quantity"
                required
              />
            </div>
            <div>
              <Label htmlFor="milkType">MilkType</Label>
                <Select name="milkType" value={editForm.milkType} onValueChange={(value) => setEditForm({ ...editForm, milkType: value })}>
                  <SelectTrigger id="milkType">
                    <SelectValue placeholder="Select Milk Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Cow</SelectItem>
                    <SelectItem value="2">Buffalo</SelectItem>
                    <SelectItem value="3">Mixed</SelectItem>
                  </SelectContent>
                </Select>
            </div>
            <div>
              <Label htmlFor="fatContent">Quantity</Label>
              <Input
                id="fatContent"
                name="fatContent"
                type="number"
                value={editForm.fatContent}
                onChange={handleEditChange}
                placeholder="Fat Content"
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={editLoading}>
                {editLoading ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Details Modal */}

      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Milk Transaction Details</DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <div><b>Full Name:</b> {selectedMilkTransaction?.farmerName}</div>
            <div><b>Shift:</b> {shiftLables[selectedMilkTransaction?.shift] ?? selectedMilkTransaction?.shift}</div>
            <div><b>Transaction Date:</b> {selectedMilkTransaction?.transactionDate}</div>
            <div><b>Quantity:</b> {selectedMilkTransaction?.quantity}</div>
            <div><b>MilkType:</b> {milkTypeLables[selectedMilkTransaction?.milkType] ?? selectedMilkTransaction?.milkType}</div>
            <div><b>Fat:</b> {selectedMilkTransaction?.fatContent || selectedMilkTransaction?.fat}</div>
            <div><b>Total Amount:</b> {selectedMilkTransaction?.totalAmount}</div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setViewModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Milk Transaction</DialogTitle>
          </DialogHeader>
          <div>
            Are you sure you want to delete <b>{selectedMilkTransaction?.fullName}</b>?
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={deleteLoading}>
              {deleteLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">Milk Transactions</CardTitle>
          <div className="flex items-center gap-2">
            <Link href="/milk-transactions/create">
              <Button className="bg-[#17a2b8] hover:bg-[#138496]">
                <Plus className="mr-2 h-4 w-4" />
                Add Transaction
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
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
              <Button variant="outline" size="icon"><FileDown className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon"><Printer className="h-4 w-4" /></Button>
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
                                  if (sortField !== column.id) {
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
                                  <ArrowUp className="h-4 w-4 text-blue-500" />
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
                                  <Input
                                    value={tempFilterValue[column.id] || ""}
                                    onChange={(e) => setTempFilterValue(prev => ({ ...prev, [column.id]: e.target.value }))}
                                    placeholder={`Filter by ${column.label}`}
                                  />
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
                ) : milktransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center">No farmers found.</TableCell>
                  </TableRow>
                ) : (
                  milktransactions.map((milkTransaction, index) => (
                    <TableRow key={milkTransaction.id}>
                      <TableCell>{startItem + index}</TableCell>
                      <TableCell>{milkTransaction.farmerName}</TableCell>
                      <TableCell>{shiftLables[milkTransaction.shift] ?? milkTransaction.shift}</TableCell>
                      <TableCell>{milkTransaction.transactionDate}</TableCell>
                      <TableCell>{milkTransaction.quantity}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditModal(milkTransaction)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openViewModal(milkTransaction)}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => openDeleteDialog(milkTransaction)}>
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
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
  );
}
