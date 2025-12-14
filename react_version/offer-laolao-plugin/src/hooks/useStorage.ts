import { useState, useEffect, useCallback } from "react"

/**
 * Chrome Storage Hook
 * 用于在 Chrome 扩展中持久化存储数据
 */
export function useStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue)
  const [isLoading, setIsLoading] = useState(true)

  // 从存储加载数据
  useEffect(() => {
    const loadData = async () => {
      try {
        if (typeof chrome !== "undefined" && chrome.storage) {
          chrome.storage.local.get([key], (result) => {
            if (result[key] !== undefined) {
              setValue(result[key])
            }
            setIsLoading(false)
          })
        } else {
          // 开发环境降级到 localStorage
          const stored = localStorage.getItem(key)
          if (stored) {
            setValue(JSON.parse(stored))
          }
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Failed to load from storage:", error)
        setIsLoading(false)
      }
    }

    loadData()
  }, [key])

  // 更新存储数据
  const updateValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const nextValue =
          typeof newValue === "function"
            ? (newValue as (prev: T) => T)(prev)
            : newValue

        // 异步保存到存储
        try {
          if (typeof chrome !== "undefined" && chrome.storage) {
            chrome.storage.local.set({ [key]: nextValue })
          } else {
            localStorage.setItem(key, JSON.stringify(nextValue))
          }
        } catch (error) {
          console.error("Failed to save to storage:", error)
        }

        return nextValue
      })
    },
    [key]
  )

  return [value, updateValue, isLoading] as const
}

/**
 * 存储键名常量
 */
export const STORAGE_KEYS = {
  RESUME_DATA: "resumeData",
  MODEL_SETTINGS: "modelSettings",
  PARSE_SETTINGS: "parseSettings",
} as const

