import { onMounted, onUnmounted } from 'vue'

import { openURL } from '@/utils/common'

export function useATagClick () {
  const handleATagClick = (e: MouseEvent) => {
    if (e.target instanceof HTMLAnchorElement) {
      if (e.target.href) {
        e.preventDefault()
        openURL(e.target.href)
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
