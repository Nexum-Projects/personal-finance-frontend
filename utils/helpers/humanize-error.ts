import { formatAmount } from "./format-amount"
import { getMessages, type I18nKey } from "@/utils/i18n/messages"
import type { PreferredLanguage } from "@/utils/user-preferences"

export type ErrorCode =
  | "BAD_REQUEST"
  | "BAD_REQUEST/INVALID_REQUEST_BODY"
  | "BAD_REQUEST/VALIDATION_ERROR"
  | "BAD_REQUEST/STOCK_INSUFFICIENT"
  | "BAD_REQUEST/INVENTORY_NOT_ASSIGNED"
  | "BAD_REQUEST/SCHEMA_RELATION_NOT_FOUND"
  | "BAD_REQUEST/COLUMN_NOT_FOUND"
  | "BAD_REQUEST/PAYMENT_TOTAL_MISMATCH"
  | "BAD_REQUEST/RUNTIME_EXCEPTION"
  | "BAD_REQUEST/INVALID_CREDENTIALS"
  | "BAD_REQUEST/ACCOUNT_INACTIVE"
  | "BAD_REQUEST/ACCOUNT_NOT_VERIFIED"
  | "BAD_REQUEST/INSUFFICIENT_FUNDS"
  | "UNAUTHORIZED"
  | "UNAUTHORIZED/INVALID_TOKEN"
  | "UNAUTHORIZED/TOKEN_EXPIRED"
  | "FORBIDDEN"
  | "FORBIDDEN/ACCESS_DENIED"
  | "NOT_FOUND"
  | "NOT_FOUND/RESOURCE_NOT_FOUND"
  | "NOT_FOUND/USER_NOT_FOUND"
  | "NOT_FOUND/PROFILE_NOT_FOUND"
  | "CONFLICT/DATA_INTEGRITY_VIOLATION"
  | "CONFLICT/UNIQUE_CONSTRAINT_VIOLATION"
  | "CONFLICT/EMAIL_ALREADY_EXISTS"
  | "CONFLICT/USERNAME_ALREADY_EXISTS"
  | "CONFLICT/FOREIGN_KEY_VIOLATION"
  | "MULTIPLE_CHOICES/AMBIGUOUS_EMBEDDING"
  | "MULTIPLE_CHOICES/AMBIGUOUS_FUNCTION_CALL"
  | "SERVICE_UNAVAILABLE/DB_CONNECTION_FAILED"
  | "SERVICE_UNAVAILABLE/INTERNAL_DB_ERROR"
  | "SERVICE_UNAVAILABLE/SCHEMA_CACHE_BUILD_FAILED"
  | "SERVICE_UNAVAILABLE/SCHEMA_CACHE_FAILED"
  | "GATEWAY_TIMEOUT/DB_POOL_ACQUISITION_TIMEOUT"
  | "GATEWAY_TIMEOUT/POOL_TIMEOUT"
  | "INTERNAL_SERVER_ERROR"
  | "INTERNAL_SERVER_ERROR/UNEXPECTED"
  | "INTERNAL_SERVER_ERROR/JWT_SECRET_MISSING"
  | "METHOD_NOT_IMPLEMENTED"

export interface HumanizedError {
  title: string
  description: string
}

export function humanizeError(
  code: string | ErrorCode,
  message?: string,
  details?: Record<string, unknown>,
  language: PreferredLanguage = "ES"
): HumanizedError {
  const messages = getMessages(language)
  // Los textos viven en utils/i18n/messages/errors.ts como `errors.<código>.title|desc`.
  const text = (key: string): string | undefined => messages[key as I18nKey]

  // Caso especial: backend lanza RuntimeException con este mensaje al intentar login
  // cuando el usuario aún no ha confirmado su email.
  if (
    typeof message === "string" &&
    message.trim() === "User account is not verified"
  ) {
    return {
      title: messages["errors.notVerified.title"],
      description: messages["errors.notVerified.desc"],
    }
  }

  if (
    code === "BAD_REQUEST/INSUFFICIENT_FUNDS" ||
    (typeof message === "string" &&
      message.toLowerCase() === "insufficient funds")
  ) {
    const amountCents = details?.amountCents
    const currentBalanceCents = details?.currentBalanceCents

    if (
      typeof amountCents === "number" &&
      typeof currentBalanceCents === "number"
    ) {
      return {
        title: messages["errors.BAD_REQUEST/INSUFFICIENT_FUNDS.title"],
        description: messages["errors.insufficientFunds.detail"]
          .replace("{available}", formatAmount(currentBalanceCents, "GT"))
          .replace("{amount}", formatAmount(amountCents, "GT")),
      }
    }
  }

  // Intentar encontrar el error en el diccionario
  const title = text(`errors.${code}.title`)

  if (title) {
    const description = text(`errors.${code}.desc`) ?? ""

    // Si es un error de validación y hay fieldErrors en details, extraerlos
    if (code === "BAD_REQUEST/VALIDATION_ERROR" && details?.fieldErrors) {
      const fieldErrors = details.fieldErrors as Record<string, string>
      const fieldErrorMessages = Object.entries(fieldErrors)
        .map(([field, error]) => {
          // Usar el nombre traducido del campo o humanizar el nombre
          const fieldName =
            text(`errors.field.${field}`) ||
            field
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())
              .trim()
          return `${fieldName}: ${error}`
        })
        .join(". ")

      return {
        title,
        description: fieldErrorMessages || message || description,
      }
    }

    // Si hay un mensaje personalizado del servidor, usarlo como descripción
    if (message && message !== description) {
      return { title, description: message }
    }
    return { title, description }
  }

  // Si no se encuentra el código, usar el mensaje del servidor o un mensaje genérico
  return {
    title: messages["errors.generic.title"],
    description: message || messages["errors.unknown.desc"],
  }
}
