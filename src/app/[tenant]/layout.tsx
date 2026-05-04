import { Metadata } from "next";
import { getTenantGrpc } from "@/lib/grpc-client";

export async function generateMetadata({ params }: { params: { tenant: string } }): Promise<Metadata> {
  const tenant = await getTenantGrpc(params.tenant);

  if (!tenant) {
    return {};
  }

  return {
    title: `${tenant.name} | ${tenant.description}`,
    description: tenant.description,
    manifest: "/manifest.webmanifest",
    themeColor: tenant.brand.primaryColor,
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: tenant.name,
    },
    // In production, these would be dynamic URLs based on the tenant's uploaded logo
    icons: {
      apple: "/apple-icon.png",
    },
  };
}

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
