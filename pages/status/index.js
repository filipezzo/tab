import { useGetDatabaseStatus } from "app/services/queries/status/use-get-db-status";

export default function StatusPage() {
  return (
    <>
      <DatabaseStatus />
    </>
  );
}

function DatabaseStatus() {
  const { data, isLoading, isError } = useGetDatabaseStatus();

  if (isLoading) {
    return <p>loading...</p>;
  }
  if (isError) {
    return <p>Error</p>;
  }

  const { updated_at, dependencies } = data;

  return (
    <div>
      <p>Última atualização - {new Date(updated_at).toLocaleString("pt-br")}</p>
      <p>Número máximo de conexões - {dependencies.database.max_connections}</p>
      <p>
        Número de conexões abertas - {dependencies.database.opened_connections}
      </p>
      <p>Versão do DB - {dependencies.database.version}</p>
    </div>
  );
}
