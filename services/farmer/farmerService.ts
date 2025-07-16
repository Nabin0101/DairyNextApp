import API_BASE_URL from  '@/lib/apiconfig'
import { apiFetch } from '@/lib/httpClient'

export interface Farmer {
  id: number
  fullName: string
  phoneNumber: string
  address: string
  email: string
}
export interface FarmerDetails {
  id: number
  fullName: string
  address: string
  email: string
}

export interface Pagination {
  total: number
  page: number
  pageSize: number
}

interface GetAllFarmersParams {
  pageNumber?: number
  pageSize?: number
  query?: string
  filters?: string
  sorts?: string
}

interface FetchFarmersResult {
  farmers: Farmer[]
  pagination: Pagination | null
}

export interface CreateFarmerParams {
fullName: string
phoneNumber: string
address: string
email: string
}


export async function createFarmer(data: CreateFarmerParams): Promise<any> {
  return await apiFetch(`${API_BASE_URL}/CmsFarmer/CreateFarmer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}


export async function fetchFarmers(params: GetAllFarmersParams = {}): Promise<FetchFarmersResult> {
  const payload = {
    pageNumber: params.pageNumber ?? 1,
    pageSize: params.pageSize ?? 20,
    query: params.query ?? "",
    filters: params.filters ?? "",
    sorts: params.sorts ?? "",
  }

  try {
    const res = await fetch(`${API_BASE_URL}/CmsFarmer/GetAllFarmer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch farmers`)
    }

    const data = await res.json()

    return {
      farmers: Array.isArray(data?.data) ? data.data : [],
      pagination: data?.meta?.pagination ?? null,
    }
  } catch (error) {
    console.error("Error fetching farmers:", error)
    return {
      farmers: [],
      pagination: null,
    }
  }

}

export async function getFarmerById(id:string): Promise<FarmerDetails> {
  try {
    const res = await fetch(`${API_BASE_URL}/CmsFarmer/GetFarmerById`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!res.ok) throw new Error(`Failed to retrieve farmer details.`);

    const data = await res.json();
    return data.data; 
  } catch (error) {
    console.error('Error getting farmer details:', error);
    throw error;
  }
}

export async function updateFarmer(farmer :any) {
    const res = await fetch(`${API_BASE_URL}/CmsFarmer/UpdateFarmer`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(farmer),
    })

    if (!res.ok){
       throw new Error(`Failed to update farmer.`)
    }
    return await res.json();
  
  }

export async function deleteFarmer(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/CmsFarmer/DeleteFarmer/${id}`, {
      method: 'DELETE',
    })

    if (!res.ok) throw new Error(`Failed to delete farmer.`)
    return true
  } catch (error) {
    console.error('Error deleting farmer:', error)
    return false
  }
}





