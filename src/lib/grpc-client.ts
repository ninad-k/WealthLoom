import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { TenantConfig } from './tenants'; // For types

const PROTO_PATH = path.resolve(process.cwd(), 'protos/tenant.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const tenantProto = grpc.loadPackageDefinition(packageDefinition).corestream as any;

// Use localhost for dev, but in production this should be an env variable pointing to the backend
// Port 5000 is the default unsecure HTTP/2 port for .NET Core / .NET 10 applications
const BACKEND_URL = process.env.GRPC_BACKEND_URL || 'localhost:5000';

const client = new tenantProto.tenant.TenantService(
  BACKEND_URL,
  grpc.credentials.createInsecure()
);

export function getTenantGrpc(domainOrId: string, token?: string): Promise<TenantConfig | null> {
  return new Promise((resolve, reject) => {
    const metadata = new grpc.Metadata();
    if (token) {
      metadata.add('Authorization', `Bearer ${token}`);
    }

    client.GetTenant({ domain_or_id: domainOrId }, metadata, (error: any, response: any) => {
      if (error) {
        console.error('[gRPC Client Error]', error);
        resolve(null); // Fallback to null on error
      } else {
        resolve(response.tenant as TenantConfig);
      }
    });
  });
}
