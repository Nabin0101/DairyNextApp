"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, ArrowLeft } from "lucide-react"
import { toast } from 'react-toastify';
import { createMilkTransactions, DropDownItem, getFarmersInDropDown } from "@/services/milktransaction/milkTransaction"

const shiftOptions = [
  { value: "0", label: "Morning" },
  { value: "1", label: "Evening" }
];
const milkTypeOptions = [
  { value: "0", label: "Cow" },
  { value: "1", label: "Buffalo" },
  { value: "2", label: "Mixed" }
];

export default function CreateMilkTransaction() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({})
  const [formData, setFormData] = useState({
    farmerName: "",
    shift: "",
    transactionDate: "",
    quantity: "",
    milkType: "",
    fat: ""
  });
  const [farmers, setFarmers] = useState<DropDownItem[]>([]);
  const [farmerSearch, setFarmerSearch] = useState("");
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setFieldErrors((prev) => ({ ...prev, [name]: "" }))
  }

  useEffect(() => {
    async function fetchFarmers() {
      try {
        const response = await getFarmersInDropDown();
        setFarmers(Array.isArray(response) ? response :[]);
      } catch (error) {
        setFarmers([]);
      }
    }
    fetchFarmers();
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const errors: { [key: string]: string } = {};
    if (!formData.farmerName.trim()) errors.farmerName = "Farmer Name is required";
    if (!formData.shift.trim()) errors.shift = "Shift is required";
    if (!formData.transactionDate.trim()) errors.transactionDate = "Transaction Date is required";
    if (!formData.quantity.trim()) errors.quantity = "Quantity is required";
    if (!formData.milkType.trim()) errors.milkType = "Milk Type is required";
    if (!formData.fat.trim()) errors.fat = "Fat is required";

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);

    try {
      await createMilkTransactions({
        farmerName: formData.farmerName,
        shift: formData.shift,
        transactionDate: formData.transactionDate,
        quantity: formData.quantity,
        milkType: formData.milkType,
        fat: formData.fat
      });

      toast.success("Milk Transaction created successfully!");
      router.push("/milk-transactions");
    } catch (err: any) {
      toast.error(err?.message || "Failed to save milk transaction");
    } finally {
      setSubmitting(false)
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <CardTitle>Add New Milk Transaction</CardTitle>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="farmerName">
                  Farmer Name <span className="text-red-500">*</span>
                </Label>
                <select
                  id="farmerName"
                  name="farmerName"
                  value={formData.farmerName}
                  onChange={handleChange}
                   className="w-full border rounded px-2 py-2"
                  required
                >
                <option value="">Select Farmer</option>
                  {farmers.map(opt => (
                    <option key={opt.key} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                {fieldErrors.farmerName && (
                  <div className="text-red-500 text-xs">{fieldErrors.farmerName}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="shift">
                  Shift <span className="text-red-500">*</span>
                </Label>
                <select
                  id="shift"
                  name="shift"
                  value={formData.shift}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-2"
                  required
                >
                  <option value="">Select shift</option>
                  {shiftOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                {fieldErrors.shift && (
                  <div className="text-red-500 text-xs">{fieldErrors.shift}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="transactionDate">
                  Transaction Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="transactionDate"
                  name="transactionDate"
                  type="date"
                  value={formData.transactionDate}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.transactionDate && (
                  <div className="text-red-500 text-xs">{fieldErrors.transactionDate}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">
                  Quantity <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.quantity && (
                  <div className="text-red-500 text-xs">{fieldErrors.quantity}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="milkType">
                  Milk Type <span className="text-red-500">*</span>
                </Label>
                <select
                  id="milkType"
                  name="milkType"
                  value={formData.milkType}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-2"
                  required
                >
                  <option value="">Select milk type</option>
                  {milkTypeOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                {fieldErrors.milkType && (
                  <div className="text-red-500 text-xs">{fieldErrors.milkType}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="fat">
                  Fat <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fat"
                  name="fat"
                  type="number"
                  value={formData.fat}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.fat && (
                  <div className="text-red-500 text-xs">{fieldErrors.fat}</div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#17a2b8] hover:bg-[#138496]" disabled={submitting}>
              <Save className="mr-2 h-4 w-4" />
              {submitting ? "Saving..." : "Create Transaction"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
