import { useQuery } from "@tanstack/react-query";
import { QUERIES } from "app/constants/queries";

async function getDatabaseStatus() {
  const response = await fetch("/api/v1/status");
  if (!response.ok) {
    throw new Error("Erro");
  }

  const data = await response.json();

  return data;
}

export function useGetDatabaseStatus() {
  return useQuery({
    queryKey: QUERIES.DBSTATUS,
    queryFn: getDatabaseStatus,
  });
}
