import type { MetadataRoute } from "next"

import { env } from "@/utils/env"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard/",
        "/logout/",
        "/login",
        "/confirm-email/",
        "/confirm-password/",
        "/reset-password/",
      ],
    },
    sitemap: `${env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  }
}
