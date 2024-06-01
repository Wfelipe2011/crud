export const formatPhone = (phoneRaw: string) => {
  const phone = phoneRaw.replace(/\D/g, "");
   const phoneLength = phone.length;
   const phoneFormatted =
     phoneLength === 11
       ? phone.replace(/^(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2 $3-$4")
       : phone.replace(/^(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
   return phoneFormatted;
 };
 
export const formatCPF = (cpfRaw: string) => {
  const cpf = cpfRaw
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  return cpf;
}