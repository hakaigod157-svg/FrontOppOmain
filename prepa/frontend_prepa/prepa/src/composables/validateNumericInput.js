
const useNumericInputValidationOnly = () => {
    const validateNumericInputOnly = (event) => {
      const char = String.fromCharCode(event.keyCode);
      // Accepte les chiffres, le point décimal, Backspace et Delete
      if (/^\d+$/.test(char) || event.key === "Backspace" || event.key === "Delete" ) {
        // Vérifie s'il y a déjà un point décimal
        return true;
      } else {
        event.preventDefault();
        return false;
      }
    };
  
    return {
      validateNumericInputOnly
    };
  };
  
  export default useNumericInputValidationOnly;