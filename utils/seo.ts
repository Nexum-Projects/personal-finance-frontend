import type { Metadata } from "next"

import { env } from "@/utils/env"

export const siteUrl = env.NEXT_PUBLIC_SITE_URL
export const siteName = env.NEXT_PUBLIC_SITE_NAME

export const landingDescription =
  "Controla ingresos, gastos, cuentas, transferencias y presupuestos mensuales desde un dashboard financiero diseñado para tomar mejores decisiones con tu dinero."

export const landingKeywords = [
  "finanzas personales",
  "control de gastos",
  "presupuesto mensual",
  "administrador financiero",
  "gestión de ingresos",
  "dashboard financiero",
  "Personal Finance",
  "Nexum Finanzas Personales",
]

export const ogImage = {
  url: "/images/og-landing.png",
  width: 1200,
  height: 630,
  alt: `${siteName} | Dashboard de finanzas personales`,
}

export const noIndexRobots: NonNullable<Metadata["robots"]> = {
  index: false,
  follow: false,
  googleBot: {
    index: false,
    follow: false,
  },
}

export function buildLandingMetadata(): Metadata {
  return {
    title: "Controla tu dinero sin hojas de cálculo",
    description: landingDescription,
    keywords: landingKeywords,
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      type: "website",
      locale: "es_GT",
      url: siteUrl,
      siteName,
      title: `${siteName} | Controla tu dinero sin hojas de cálculo`,
      description: landingDescription,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteName} | Controla tu dinero sin hojas de cálculo`,
      description: landingDescription,
      images: [ogImage.url],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  }
}

export function buildLandingStructuredData() {
  const organizationId = `${siteUrl}/#organization`
  const websiteId = `${siteUrl}/#website`
  const softwareId = `${siteUrl}/#software`

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: siteName,
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/logo_2.png`,
        },
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: siteUrl,
        name: siteName,
        description: landingDescription,
        inLanguage: "es-GT",
        publisher: {
          "@id": organizationId,
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": softwareId,
        name: siteName,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        url: siteUrl,
        description: landingDescription,
        image: `${siteUrl}${ogImage.url}`,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        publisher: {
          "@id": organizationId,
        },
        featureList: [
          "Control de ingresos y gastos",
          "Administración de cuentas",
          "Transferencias entre cuentas",
          "Presupuestos mensuales",
          "Dashboard financiero",
          "Exportación de datos",
        ],
      },
    ],
  }
}

export function buildRegisterMetadata(): Metadata {
  return {
    title: "Crear cuenta gratuita",
    description:
      "Regístrate gratis en Personal Finance y empieza a controlar ingresos, gastos, cuentas y presupuestos mensuales desde un dashboard claro.",
    alternates: {
      canonical: `${siteUrl}/register`,
    },
    openGraph: {
      type: "website",
      locale: "es_GT",
      url: `${siteUrl}/register`,
      siteName,
      title: `${siteName} | Crear cuenta gratuita`,
      description:
        "Crea tu cuenta gratis y organiza tus finanzas personales con presupuestos, categorías y reportes.",
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export function buildNoIndexMetadata(title: string): Metadata {
  return {
    title,
    robots: noIndexRobots,
  }
}
