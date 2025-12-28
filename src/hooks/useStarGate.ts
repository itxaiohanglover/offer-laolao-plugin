import { useCallback } from "react"
import { useStorage, STORAGE_KEYS } from "./useStorage"

/**
 * Star Gate 状态接口
 */
export interface StarGateState {
  hasStarred: boolean
  starredAt: number | null
}

/**
 * 默认状态
 */
const defaultStarGateState: StarGateState = {
  hasStarred: false,
  starredAt: null,
}

/**
 * GitHub 仓库信息
 */
export const GITHUB_REPO = {
  owner: "itxaiohanglover",
  repo: "offer-laolao-plugin",
  url: "https://github.com/itxaiohanglover/offer-laolao-plugin",
}

/**
 * Star Gate Hook
 * 管理用户 Star 验证状态
 */
export function useStarGate() {
  const [starGateState, setStarGateState, isLoading] = useStorage<StarGateState>(
    STORAGE_KEYS.STAR_GATE,
    defaultStarGateState
  )

  /**
   * 确认用户已 Star
   */
  const confirmStar = useCallback(() => {
    setStarGateState({
      hasStarred: true,
      starredAt: Date.now(),
    })
  }, [setStarGateState])

  /**
   * 重置 Star 状态（用于测试或调试）
   */
  const resetStar = useCallback(() => {
    setStarGateState(defaultStarGateState)
  }, [setStarGateState])

  /**
   * 检查是否已解锁高级功能
   */
  const isUnlocked = starGateState.hasStarred

  return {
    isLoading,
    isUnlocked,
    hasStarred: starGateState.hasStarred,
    starredAt: starGateState.starredAt,
    confirmStar,
    resetStar,
    githubRepo: GITHUB_REPO,
  }
}

