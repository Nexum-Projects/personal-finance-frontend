import type { PreferredLanguage } from "@/utils/user-preferences"

import { ES_COMMON_MESSAGES, EN_COMMON_MESSAGES, PT_COMMON_MESSAGES } from "./messages/common"
import { ES_AUTH_MESSAGES, EN_AUTH_MESSAGES, PT_AUTH_MESSAGES } from "./messages/auth"
import { ES_DASHBOARD_MESSAGES, EN_DASHBOARD_MESSAGES, PT_DASHBOARD_MESSAGES } from "./messages/dashboard"
import { ES_ACCOUNTS_MESSAGES, EN_ACCOUNTS_MESSAGES, PT_ACCOUNTS_MESSAGES } from "./messages/accounts"
import { ES_CATEGORIES_MESSAGES, EN_CATEGORIES_MESSAGES, PT_CATEGORIES_MESSAGES } from "./messages/categories"
import {
  ES_TRANSACTIONS_MESSAGES,
  EN_TRANSACTIONS_MESSAGES,
  PT_TRANSACTIONS_MESSAGES,
} from "./messages/transactions"
import { ES_TRANSFERS_MESSAGES, EN_TRANSFERS_MESSAGES, PT_TRANSFERS_MESSAGES } from "./messages/transfers"
import {
  ES_MONTHLY_PERIODS_MESSAGES,
  EN_MONTHLY_PERIODS_MESSAGES,
  PT_MONTHLY_PERIODS_MESSAGES,
} from "./messages/monthly-periods"
import { ES_PROFILE_MESSAGES, EN_PROFILE_MESSAGES, PT_PROFILE_MESSAGES } from "./messages/profile"

export const ES_MESSAGES = {
  ...ES_COMMON_MESSAGES,
  ...ES_AUTH_MESSAGES,
  ...ES_DASHBOARD_MESSAGES,
  ...ES_ACCOUNTS_MESSAGES,
  ...ES_CATEGORIES_MESSAGES,
  ...ES_TRANSACTIONS_MESSAGES,
  ...ES_TRANSFERS_MESSAGES,
  ...ES_MONTHLY_PERIODS_MESSAGES,
  ...ES_PROFILE_MESSAGES,
} as const

export type I18nKey = keyof typeof ES_MESSAGES
export type Messages = Record<I18nKey, string>

export const EN_MESSAGES: Messages = {
  ...EN_COMMON_MESSAGES,
  ...EN_AUTH_MESSAGES,
  ...EN_DASHBOARD_MESSAGES,
  ...EN_ACCOUNTS_MESSAGES,
  ...EN_CATEGORIES_MESSAGES,
  ...EN_TRANSACTIONS_MESSAGES,
  ...EN_TRANSFERS_MESSAGES,
  ...EN_MONTHLY_PERIODS_MESSAGES,
  ...EN_PROFILE_MESSAGES,
}

export const PT_MESSAGES: Messages = {
  ...PT_COMMON_MESSAGES,
  ...PT_AUTH_MESSAGES,
  ...PT_DASHBOARD_MESSAGES,
  ...PT_ACCOUNTS_MESSAGES,
  ...PT_CATEGORIES_MESSAGES,
  ...PT_TRANSACTIONS_MESSAGES,
  ...PT_TRANSFERS_MESSAGES,
  ...PT_MONTHLY_PERIODS_MESSAGES,
  ...PT_PROFILE_MESSAGES,
}

export function getMessages(language: PreferredLanguage): Messages {
  switch (language) {
    case "EN":
      return EN_MESSAGES
    case "PT":
      return PT_MESSAGES
    case "ES":
    default:
      return ES_MESSAGES
  }
}

