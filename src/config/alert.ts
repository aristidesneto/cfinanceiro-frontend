import Swal from 'sweetalert2'
import { type ToastOptions, toast } from 'vue3-toastify'

export function alertSuccess(data: any) {
  toast.success(data, {
    theme: 'colored',
  } as ToastOptions)
}

export function alertError(data: any) {
  toast.error(data.text, {
    theme: 'colored',
    autoClose: 7000,
    dangerouslyHTMLString: true,
  } as ToastOptions)
}

export async function alertConfirmed(data: any) {
  return await Swal.fire({
    title: data.title,
    icon: data.icon ?? 'question',
    showCancelButton: true,
    confirmButtonText: data.confirmButtonText,
    confirmButtonColor: data.confirmButtonColor || 'red',
    cancelButtonText: data.cancelButtonText,
  })
}
