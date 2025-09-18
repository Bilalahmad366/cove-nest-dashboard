
import Swal from "sweetalert2";

// Show alert and return a promise to handle confirmation
export const showAlert = async (): Promise<boolean> => {
    const result = await Swal.fire({
        icon: 'warning',
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        showCancelButton: true,
        confirmButtonText: 'Delete',
        padding: '2em',
        customClass: { popup: 'sweet-alerts' },
    });

    return result.isConfirmed; // Return true if confirmed, false otherwise
};
