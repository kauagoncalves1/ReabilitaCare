// Máscara CPF
document.getElementById("cpf").addEventListener("input", function () {
  let v = this.value.replace(/\D/g, "").slice(0, 11);
  v = v
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  this.value = v;
});

// Máscara Telefone
document.getElementById("telefone").addEventListener("input", function () {
  let v = this.value.replace(/\D/g, "").slice(0, 11);
  if (v.length > 10) v = v.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  else if (v.length > 6) v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  else if (v.length > 2) v = v.replace(/(\d{2})(\d{0,5})/, "($1) $2");
  this.value = v;
});

// Submit
document.getElementById("formMedico").addEventListener("submit", function (e) {
  e.preventDefault();

  const senha = document.getElementById("senha").value;
  const confirmar = document.getElementById("confirmar_senha").value;
  if (senha !== confirmar) {
    alert("As senhas não coincidem. Por favor, verifique.");
    return;
  }
  if (!document.getElementById("terms").checked) {
    alert("Por favor, aceite os Termos de Uso para continuar.");
    return;
  }

  const btn = this.querySelector("button[type='submit']");
  btn.textContent = "Enviando...";
  btn.disabled = true;

  setTimeout(() => {
    document.getElementById("successMsg").classList.add("show");
    btn.textContent = "Cadastro Enviado ✓";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 1800);
});
