import { onBeforeUnmount, onMounted } from 'vue'

function disableDrag(e: DragEvent) {
  const dropzone = document.getElementById('upload-area')
  if (dropzone === null || !dropzone.contains(<Node>e.target)) {
    e.preventDefault()
    e.dataTransfer!.effectAllowed = 'none'
    e.dataTransfer!.dropEffect = 'none'
  }
}

export function useDragEventListeners() {
  onMounted(() => {
    window.addEventListener('dragenter', disableDrag, false)
    window.addEventListener('dragover', disableDrag)
    window.addEventListener('drop', disableDrag)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('dragenter', disableDrag, false)
    window.removeEventListener('dragover', disableDrag)
    window.removeEventListener('drop', disableDrag)
  })
}
