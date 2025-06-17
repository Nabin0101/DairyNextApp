"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Save } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// Mock data for farmers and items
const mockFarmers = [
  { id: 1, name: "Rajesh Kumar" },
  { id: 2, name: "Suresh Patel" },
  { id: 3, name: "Mahesh Singh" },
  { id: 4, name: "Dinesh Sharma" },
  { id: 5, name: "Ramesh Verma" },
]

const mockItems = [
  { id: 1, name: "Cattle Feed", price: 1200 },
  { id: 2, name: "Mineral Mixture", price: 500 },
  { id: 3, name: "Veterinary Medicine", price: 350 },
  { id: 4, name: "Fodder Seeds", price: 800 },
  { id: 5, name: "Equipment", price: 2500 },
]

export default function FarmerExpensePage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [formData, setFormData] = useState({
    farmerId: "",
    itemId: "",
    quantity: "1",
    rate: "",
    amount: "0",
  })

  const handleFarmerChange = (value: string) => {
    setFormData((prev) => ({ ...prev, farmerId: value }))
  }

  const handleItemChange = (value: string) => {
    const selectedItem = mockItems.find((item) => item.id.toString() === value)
    if (selectedItem) {
      setFormData((prev) => ({
        ...prev,
        itemId: value,
        rate: selectedItem.price.toString(),
        amount: (selectedItem.price * Number.parseInt(prev.quantity)).toString(),
      }))
    }
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = e.target.value
    const rate = formData.rate ? Number.parseFloat(formData.rate) : 0
    const amount = (Number.parseInt(quantity) * rate).toString()

    setFormData((prev) => ({
      ...prev,
      quantity,
      amount,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your API
    console.log("Form submitted:", {
      ...formData,
      date: date ? format(date, "yyyy-MM-dd") : "",
    })

    // Reset form
    setFormData({
      farmerId: "",
      itemId: "",
      quantity: "1",
      rate: "",
      amount: "0",
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Add Farmer Expense</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="farmer">
                  Farmer <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.farmerId} onValueChange={handleFarmerChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select farmer" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockFarmers.map((farmer) => (
                      <SelectItem key={farmer.id} value={farmer.id.toString()}>
                        {farmer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>
                  Date <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="item">
                  Item <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.itemId} onValueChange={handleItemChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select item" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockItems.map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">
                  Quantity <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={handleQuantityChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rate">
                  Rate (Rs) <span className="text-red-500">*</span>
                </Label>
                <Input id="rate" type="number" value={formData.rate} readOnly className="bg-gray-50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (Rs)</Label>
                <Input id="amount" type="number" value={formData.amount} readOnly className="bg-gray-50" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" className="bg-[#17a2b8] hover:bg-[#138496]">
              <Save className="mr-2 h-4 w-4" />
              Save Expense
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
