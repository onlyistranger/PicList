import { onMounted, onUnmounted } from 'vue'

import { sendRPC } from '@/utils/common'
import { IRPCActionType } from 'root/src/universal/types/enum'

export function useATagClick() {
  const handleATagClick = (e: MouseEvent) => {
    if (e.target instanceof HTMLAnchorElement) {
      if (e.target.href) {
        e.preventDefault()
        sendRPC(IRPCActionType.OPEN_URL, e.target.href)
      }
    }
  }
  onMounted(() => {
    document.addEventListener('click', handleATagClick)
  })
  onUnmounted(() => {
    document.removeEventListener('click', handleATagClick)
  })
}
