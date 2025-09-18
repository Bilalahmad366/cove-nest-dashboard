import Swal from "sweetalert2";

const showMessage = (msg: string = "", type: "success" | "error" | "info" | "warning" = "success") => {
  const toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 3000,
    customClass: { container: "toast" },
  });

  toast.fire({
    icon: type,
    title: msg,
    padding: "10px 20px",
  });
};

export default showMessage;
