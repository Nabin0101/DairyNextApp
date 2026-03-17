import API_BASE_URL from '@/lib/apiconfig';
import { apiFetch } from '@/lib/httpClient';

export interface MilkRate {
  id: number;
  milkType: number;
  ratePerLiter: number;
  fatContent: number;
}

export interface Pagination {
  total: number;
  pageSize: number;
  totalPage: number;
}

interface GetAllMilkRatesParams {
  pageNumber?: number;
  pageSize?: number;
  query?: string;
  filters?: string;
  sorts?: string;
}

interface FetchMilkRatesResult {
  milkRates: MilkRate[];
  pagination: Pagination | null;
}

export interface UpdateMilkRateParams {
  id: number;
  milkType: number;
  ratePerLiter: number;
  fatContent: number;
}

export async function fetchMilkRates(params: GetAllMilkRatesParams = {}): Promise<FetchMilkRatesResult> {
  const payload = {
    pageNumber: params.pageNumber ?? 1,
    pageSize: params.pageSize ?? 10,
    query: params.query ?? '',
    filters: params.filters ?? '',
    sorts: params.sorts ?? '',
  };

  try {
    const res = await fetch(`${API_BASE_URL}/CmsMilkRate/GetAllMilkRateList`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error('Failed to fetch milk rates');
    }

    const data = await res.json();

    return {
      milkRates: Array.isArray(data?.data) ? data.data : [],
      pagination: data?.meta?.pagination ?? null,
    };
  } catch (error) {
    console.error('Error fetching milk rates:', error);
    return {
      milkRates: [],
      pagination: null,
    };
  }
}

export async function updateMilkRate(data: UpdateMilkRateParams) {
  const res = await fetch(`${API_BASE_URL}/CmsMilkRate/UpdateMilkRate`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok){
     throw new Error(`Failed to update milk rate.`)
  }
  return await res.json();

}

export async function deleteMilkRate(id: number): Promise<boolean> {
try {
  const res = await fetch(`${API_BASE_URL}/CmsMilkRate/DeleteMilkRate/${id}`, {
    method: 'DELETE',
  })

  if (!res.ok) throw new Error(`Failed to delete milk rate.`)
  return true
} catch (error) {
  console.error('Error deleting milk rate:', error)
  return false
}
}