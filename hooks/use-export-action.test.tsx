import type { ReactNode } from "react"
import { useState } from "react"
import { act, renderHook, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { toast } from "sonner"
import { I18nProvider } from "@/components/i18n/i18n-provider"
import { ES_MESSAGES } from "@/utils/i18n/messages"
import { useExportAction } from "./use-export-action"

vi.mock("sonner", () => ({ toast: { error: vi.fn() } }))

const wrapper = ({ children }: { children: ReactNode }) => (
  <I18nProvider language="ES" messages={ES_MESSAGES}>
    {children}
  </I18nProvider>
)

function useExportWithData() {
  const [data, setData] = useState<string[]>([])
  const exportAction = useExportAction({
    data,
    pageSize: 10,
    sort: { direction: "DESC", field: null },
  })
  return { ...exportAction, data, setData }
}

describe("useExportAction.loadBeforePrint", () => {
  it("resuelve cuando los datos cargados ya están en el estado", async () => {
    const { result } = renderHook(useExportWithData, { wrapper })

    const loading = result.current.loadBeforePrint(
      async () => ["a", "b"],
      result.current.setData
    )

    await waitFor(() => expect(result.current.data).toEqual(["a", "b"]))
    await expect(loading).resolves.toBeUndefined()
    expect(result.current.data).toEqual(["a", "b"])
    expect(result.current.isExporting).toBeNull()
  })

  it("cancela la exportación y avisa si la carga falla", async () => {
    const { result } = renderHook(useExportWithData, { wrapper })
    const error = new Error("network")

    await act(async () => {
      await expect(
        result.current.loadBeforePrint(async () => {
          throw error
        }, result.current.setData)
      ).rejects.toBe(error)
    })

    expect(result.current.isExporting).toBeNull()
    expect(result.current.promiseResolveRef.current).toBeNull()
    expect(toast.error).toHaveBeenCalledWith(ES_MESSAGES["export.loadError"])
  })
})
