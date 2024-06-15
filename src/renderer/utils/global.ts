import { ref } from 'vue'
import { triggerRPC } from '@/utils/common'
import { IRPCActionType } from '#/types/enum'

const osGlobal = ref<string>(process.platform)
const picBedGlobal = ref<IPicBedType[]>([])
const pageReloadCount = ref(0)

async function updatePicBedGlobal() {
  picBedGlobal.value = (await triggerRPC<IPicBedType[]>(IRPCActionType.MAIN_GET_PICBED))!
}

async function updatePageReloadCount() {
  pageReloadCount.value++
}

export { osGlobal, pageReloadCount, picBedGlobal, updatePicBedGlobal, updatePageReloadCount }
