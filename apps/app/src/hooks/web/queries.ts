// Stub file for web queries - to be replaced with trail queries
interface Web {
  id: string;
  title: string | null;
  url: string;
  prompt: string | null;
  status: string;
  createdAt: string;
  spaceId: string | null;
}

export function useWebs() {
  return {
    webs: [] as Web[],
    isLoading: false,
    error: null
  };
}

export function useWeb(id: string) {
  return {
    data: null,
    isLoading: false,
    error: null
  };
}