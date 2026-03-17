import API_BASE_URL from '@/lib/apiconfig'
import { apiFetch } from '@/lib/httpClient'

export interface MilkTransaction {
    id: number
    shift: string
    quantity: string
    customerName: string
    transactionDate: string
}
export interface MilkTransactionDetails {
    id: number
    shift: string
    quantity: string
    milkType: string
    fatContent: string
    totalAmount: Float16Array
    customerName: string
    transactionDate: string
}
export interface Pagination {
    total: number
    page: number
    pageSize: number
}

interface GetAllMilkTransactionsParams {
    pageNumber?: number
    pageSize?: number
    query?: string
    filters?: string
    sorts?: string
}

interface FetchFarmersResult {
    milkTransactions: MilkTransaction[]
    pagination: Pagination | null
}

export interface CreateMilkTransactionParams {
    shift: string
    quantity: string
    milkType: string
    fat: string
    farmerName: string
    transactionDate: string
}

export interface DropDownItem {
  key: string;
  label: string;
  value: string;
}

export async function createMilkTransactions(data: CreateMilkTransactionParams): Promise<any> {
    return await apiFetch(`${API_BASE_URL}/CmsMilkTransaction/CreateMilkTransaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
}


export async function fetchMilkTransactions(params: GetAllMilkTransactionsParams = {}): Promise<FetchFarmersResult> {
    const payload = {
        pageNumber: params.pageNumber ?? 1,
        pageSize: params.pageSize ?? 20,
        query: params.query ?? "",
        filters: params.filters ?? "",
        sorts: params.sorts ?? "",
    }

    try {
        const res = await fetch(`${API_BASE_URL}/CmsMilkTransaction/GetAllMilkTransaction`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })

        if (!res.ok) {
            throw new Error(`Failed to fetch milk transactions.`)
        }

        const data = await res.json()

        return {
            milkTransactions: Array.isArray(data?.data) ? data.data : [],
            pagination: data?.meta?.pagination ?? null,
        }
    } catch (error) {
        console.error("Error fetching milk transactions:", error)
        return {
            milkTransactions: [],
            pagination: null,
        }
    }

}

export async function getMilkTransactionById(id: string): Promise<MilkTransactionDetails> {
    try {
        const res = await fetch(`${API_BASE_URL}/CmsMilkTransaction/GetMilkTransactionById/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })

        if (!res.ok) throw new Error(`Failed to retrieve milk transaction details.`);

        const data = await res.json();
        return data.data;
    } catch (error) {
        console.error('Error getting milk transaction details:', error);
        throw error;
    }
}

export async function updateMilkTransaction(milkTransactions: any) {
    const res = await fetch(`${API_BASE_URL}/CmsMilkTransaction/UpdateMilkTransaction`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(milkTransactions),
    })

    if (!res.ok) {
        throw new Error(`Failed to update milk transaction.`)
    }
    return await res.json();

}

export async function deleteMilkTransaction(id: string): Promise<boolean> {
    try {
        const res = await fetch(`${API_BASE_URL}/CmsMilkTransaction/DeleteMilkTransaction/${id}`, {
            method: 'DELETE',
        })

        if (!res.ok) throw new Error(`Failed to delete milk transaction.`)
        return true
    } catch (error) {
        console.error('Error deleting milk transaction:', error)
        return false
    }
}

export async function getFarmersInDropDown(): Promise<DropDownItem[]> {
    try {
        const res = await fetch(`${API_BASE_URL}/CmsFarmer/GetFarmerInDropDown`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })

        if (!res.ok) throw new Error(`Failed to retrieve farmer.`)
        const result = await res.json();
        return result;
    } catch (error) {
        console.error('Error deleting milk transaction:', error)
        return [];
    }
}





