// componente per generare il footer delle pagine admin
// mostro i crediti e l'anno attuale in fondo alla pagina
export const Footer = {
    render() {
        return `
            <footer style="margin-top: 50px; text-align: center; color: #555; font-size: 0.8rem;">
                <p>&copy; ${new Date().getFullYear()} Dashboard Admin - All Rights Reserved.</p>
            </footer>
        `;
    }
};
//# sourceMappingURL=footer.js.map