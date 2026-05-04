import { NextRequest, NextResponse } from "next/server";
import { getTenantGrpc } from "@/lib/grpc-client";

export async function GET(
  request: NextRequest,
  { params }: { params: { tenant: string } }
) {
  const tenantId = params.tenant;
  const tenant = await getTenantGrpc(tenantId);

  // If the tenant doesn't exist, we fallback to the default or handle it gracefully
  if (!tenant) {
    return new NextResponse("Tenant not found", { status: 404 });
  }

  const manifest = {
    name: tenant.name,
    short_name: tenant.brand.first + tenant.brand.second,
    description: tenant.description,
    start_url: "/",
    display: "standalone",
    background_color: tenant.brand.secondaryColor,
    theme_color: tenant.brand.primaryColor,
    icons: [
      {
        // Mock icons - in production, these would be tenant-specific logos
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };

  return new NextResponse(JSON.stringify(manifest), {
    headers: {
      "Content-Type": "application/manifest+json",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
