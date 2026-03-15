import { useCallback, useEffect, useState } from "react"
import type { SheetRow } from "../types"

type RefreshSource = "init" | "manual" | "auto"

export function useDashboardData(sheetId: string) {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`

  const [data, setData] = useState<SheetRow[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  const initDashboard = useCallback(async (source: RefreshSource = "manual") => {
    try {
      setIsLoading(true)
      setError(null)
      setLoadingMessage(source === "manual" ? "กำลังรีเฟรชข้อมูล..." : "กำลังโหลดข้อมูล...")

      const res = await fetch(url)
      const text = await res.text()

      const jsonStart = text.indexOf("{")
      const jsonEnd = text.lastIndexOf("}")

      if (jsonStart === -1 || jsonEnd === -1 || jsonStart >= jsonEnd) {
        throw new Error("รูปแบบข้อมูลจาก Google Sheet ไม่ถูกต้อง")
      }

      const json = JSON.parse(text.slice(jsonStart, jsonEnd + 1))

      const cols: string[] = json.table.cols.map((c: { label: string }) => c.label)

      const rows = json.table.rows.map((r: { c: { v: unknown }[] }) =>
        r.c.map((c) => (c ? c.v : null))
      )

      const result = rows.map((row: unknown[]) => {
        const obj: Record<string, unknown> = {}

        cols.forEach((col, i) => {
          obj[col] = row[i]
        })

        return obj as SheetRow
      })

      setData(result)
      setLastUpdated(new Date().toLocaleString("th-TH"))
    } catch (err: unknown) {
      console.error("โหลดข้อมูล Google Sheet ไม่สำเร็จ", err)
      setError("ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง")
    } finally {
      setIsLoading(false)
      setLoadingMessage("")
    }
  }, [url])

  useEffect(() => {
    void initDashboard("init")

    const intervalId = setInterval(() => {
      void initDashboard("auto")
    }, 5 * 60 * 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [initDashboard])

  return {
    data,
    isLoading,
    loadingMessage,
    error,
    lastUpdated,
    initDashboard,
  }
}
