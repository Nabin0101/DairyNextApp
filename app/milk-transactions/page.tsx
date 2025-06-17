"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, Filter, MoreHorizontal, FileDown, Upload, Download } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for milk transactions
const mockTransactions = [
  {
    id: 1,
    date: "2023-06-12",
    farmer: "Rajesh Kumar",
    shift: "Morning",
    quantity: 5.2,
    fat: 4.2,
    snf: 8.5,
    rate: 45,
    amount: 234,
  },
  {
    id: 2,
    date: "2023-06-12",
    farmer: "Suresh Patel",
    shift: "Evening",
    quantity: 3.8,
    fat: 4.0,
    snf: 8.3,
    rate: 43,
    amount: 163.4,
  },
  {
    id: 3,
    date: "2023-06-11",
    farmer: "Mahesh Singh",
    shift: "Morning",
    quantity: 4.5,
    fat: 4.5,
    snf: 8.7,
    rate: 48,
    amount: 216,
  },
  {
    id: 4,
    date: "2023-06-11",
    farmer: "Dinesh Sharma",
    shift: "Evening",
    quantity: 2.9,
    fat: 3.8,
    snf: 8.1,
    rate: 40,
    amount: 116,
  },
  {
    id: 5,
    date: "2023-06-10",
    farmer: "Ramesh Verma",
    shift: "Morning",
    quantity: 6.1,
    fat: 4.3,
    snf: 8.6,
    rate: 46,
    amount: 280.6,
  },
]

export default function MilkTransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [shiftFilter, setShiftFilter] = useState("")

  const filteredTransactions = mockTransactions.filter(
    (transaction) =>
      (transaction.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.id.toString().includes(searchTerm)) &&
      (dateFilter ? transaction.date === dateFilter : true) &&
      (shiftFilter ? transaction.shift === shiftFilter : true),
  )

  return (
    <div className="space-y-4">
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
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
              </div>
              <div>
                <Select value={shiftFilter} onValueChange={setShiftFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Shifts</SelectItem>
                    <SelectItem value="Morning">Morning</SelectItem>
                    <SelectItem value="Evening">Evening</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Upload className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <FileDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Farmer</TableHead>
                  <TableHead>Shift</TableHead>
                  <TableHead>Qty (L)</TableHead>
                  <TableHead>Fat %</TableHead>
                  <TableHead>SNF %</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.id}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.farmer}</TableCell>
                    <TableCell>{transaction.shift}</TableCell>
                    <TableCell>{transaction.quantity}</TableCell>
                    <TableCell>{transaction.fat}</TableCell>
                    <TableCell>{transaction.snf}</TableCell>
                    <TableCell>{transaction.rate}</TableCell>
                    <TableCell>Rs {transaction.amount}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Link href={`/milk-transactions/edit/${transaction.id}`} className="w-full">
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
