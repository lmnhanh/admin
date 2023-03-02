import { toast } from "react-toastify";
import { Spinner } from 'flowbite-react';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';

export default async function ToastPromise(promise, customMessage){
  return await toast.promise(promise, {
    pending: {
      render() {
        return customMessage?.pending ?? 'Đang tải ...';
      },
      icon: <Spinner size={'md'}/>,
    },
    success: {
      render({ data }) {
        return customMessage?.success(data) ?? 'Thành công';
      },
      icon: {faCheck},
    },
    error: {
      render({ data }) {
        return customMessage?.error(data) ?? 'Lỗi';
      },
      icon: {faXmark},
    },
  });
}