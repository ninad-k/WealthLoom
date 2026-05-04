import { getTenantGrpc } from "@/lib/grpc-client";
import TenantClientPage from "./ClientPage";

export default async function TenantHomePage({ params }: { params: { tenant: string } }) {
  const tenantId = params.tenant;
  const tenant = await getTenantGrpc(tenantId);

  if (!tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">School Not Found</h1>
          <p className="text-muted-foreground">The academy you are looking for does not exist or the backend is unreachable.</p>
        </div>
      </div>
    );
  }

  return <TenantClientPage tenant={tenant} />;
}
