const menuToggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav");
const navLinks = nav.querySelectorAll("a");

function fecharMenu() {
    nav.classList.remove("active");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
}

menuToggle.addEventListener("click", () => {
    const aberto = nav.classList.toggle("active");

    menuToggle.classList.toggle("active", aberto);
    menuToggle.setAttribute("aria-expanded", String(aberto));
    menuToggle.setAttribute(
        "aria-label",
        aberto ? "Fechar menu" : "Abrir menu"
    );
});

navLinks.forEach(link => {
    link.addEventListener("click", fecharMenu);
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        fecharMenu();
    }
});
