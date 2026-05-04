import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.resolve(__dirname, '../protos/tenant.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const tenantProto = grpc.loadPackageDefinition(packageDefinition).corestream as any;

// Migrated data from the frontend
const MOCK_TENANTS: Record<string, any> = {
  "wealthloom": {
    id: "wealthloom",
    name: "WealthLoom Academy",
    company: "WealthLoom Inc.",
    description: "Master the markets with precision and vision.",
    custom_domain: "academy.wealthloom.com",
    brand: {
      first: "Wealth",
      second: "Loom",
      primary_color: "#f59e0b",
      secondary_color: "#020617"
    },
    pricing: [
      { name: "Free", price: "$0", features: ["Basic Videos"] },
      { name: "Pro", price: "$49", features: ["All Videos", "Flow Analysis"] }
    ]
  },
  "tradezenith": {
    id: "tradezenith",
    name: "TradeZenith",
    company: "Zenith Trading Group",
    description: "The peak of trading education.",
    brand: {
      first: "Trade",
      second: "Zenith",
      primary_color: "#10b981",
      secondary_color: "#064e3b"
    },
    pricing: [
      { name: "Starter", price: "$29", features: ["Intro Course"] },
      { name: "Elite", price: "$99", features: ["Masterclass"] }
    ]
  }
};

function getTenantHandler(call: any, callback: any) {
  const domainOrId = call.request.domain_or_id;
  
  console.log(`[gRPC] Received request for tenant: ${domainOrId}`);

  // 1. Check custom domain
  let tenant = Object.values(MOCK_TENANTS).find((t: any) => t.custom_domain === domainOrId);
  
  // 2. Check subdomains/id
  if (!tenant) {
    tenant = MOCK_TENANTS[domainOrId];
  }

  // 3. Fallback
  if (!tenant) {
    tenant = MOCK_TENANTS["wealthloom"];
  }

  // gRPC responses require mapping to exactly what the proto defines.
  callback(null, { tenant });
}

function main() {
  const server = new grpc.Server();
  
  server.addService(tenantProto.tenant.TenantService.service, {
    GetTenant: getTenantHandler,
  });

  const PORT = '0.0.0.0:50051';
  server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`[gRPC] Backend Server running at ${PORT}`);
  });
}

main();
