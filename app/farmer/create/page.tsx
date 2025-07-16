"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save } from "lucide-react"
import { toast } from 'react-toastify';
// import { toast } from "sonner";

import { createFarmer } from "@/services/farmer/farmerService"
import { ApiError } from "@/lib/httpClient"
import { sub } from "date-fns"

export default function CreateFarmer() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setFieldErrors((prev) => ({ ...prev, [name]: "" })); // Clear error for this field
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Client-side validation
  const errors: { [key: string]: string } = {};
  if (!formData.name.trim()) errors.name = "Farmer Name is required";
  if (!formData.phone.trim()) errors.phone = "Phone Number is required";
  if (!formData.address.trim()) errors.address = "Address is required";
  if (!formData.email.trim()) errors.email = "Email is required";

  setFieldErrors(errors);

  // If there are any errors, block submission
  if (Object.keys(errors).length > 0) return;

  setSubmitting(true);

  try {
    await createFarmer({
      fullName: formData.name,
      phoneNumber: formData.phone,
      address: formData.address,
      email: formData.email,
    });

    toast.success("Farmer created successfully!");
    console.log("Redirecting to /farmer");
    router.push("/farmer");
  } 
  catch (err: any) {

    if(err?.errors && Array.isArray(err.errors)) {
      err.errors.forEach((errorObj:any) => {
        toast.error(errorObj.detail || errorObj.title || "An error occurred");
      });
    }
      
  else if (err?.errors && typeof err.errors === 'object') {
    const fieldErrors = err.errors;
    Object.entries(fieldErrors).forEach(([field, messages]) => {
      (messages as string[]).forEach((msg) => {
        toast.error(`${msg}`);
      });
    });
  }

  else {
    console.log(err);
     toast.error(err?.message || "Failed to save farmer");
  }
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
            <CardTitle>Add New Farmer</CardTitle>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Farmer Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.name && (
                  <div className="text-red-500 text-xs">{fieldErrors.name}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.phone && (
                  <div className="text-red-500 text-xs">{fieldErrors.phone}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">
                  Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Enter address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.address && (
                  <div className="text-red-500 text-xs">{fieldErrors.address}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="Enter email  "
                  value={formData.email}
                  onChange={handleChange}
                />
                {fieldErrors.email && (
                  <div className="text-red-500 text-xs">{fieldErrors.email}</div>
                )}
              </div>

            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#17a2b8] hover:bg-[#138496]" onClick={handleSubmit}>
              <Save className="mr-2 h-4 w-4" />
              Create Farmer
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
