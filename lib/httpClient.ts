export type ProblemDetails = {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  errors?: Record<string, string[]>;
  traceId?: string;
};

export class ApiError extends Error {
  status?: number;
  errors?: Record<string, string[]>;

  constructor(problem: ProblemDetails) {
    super(problem.title ?? problem.detail ?? "Request failed");
    this.name = "ApiError";
    this.status = problem.status;
    this.errors = problem.errors;
  }
}

export async function apiFetch<T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(input, init);

  // 2xx → normal JSON (or empty)
  if (res.ok) {
        console.log("API Response:", res);
    // some endpoints return 204; guard against empty body
    return (await res.json().catch(() => ({}))) as T;

  }

  // Attempt to read ProblemDetails
  let problem: ProblemDetails = {};
  try {
    problem = await res.json();
  } catch {
    problem.title = await res.text();
  }

  throw new ApiError(problem);
}