import { ref } from 'vue';
import VueSweetalert2 from 'sweetalert2';

export default function useConfirmation() {
  const confirmAction = async (title, text) => {
    const { value: confirm } = await VueSweetalert2.fire({
      title: title,
      html: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    });

    return confirm;
  };

  return {
    confirmAction
  };
}