import Swal from 'sweetalert2'

export function alertSuccess(data: any) {
  Swal.fire({
    title: data,
    icon: 'success',
  })
}

export function alertError(data: any) {
  Swal.fire({
    title: data.title,
    html: data.text,
    icon: 'error',
  })
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
