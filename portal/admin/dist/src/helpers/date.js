export const DateHelper = {
    format(date) {
        const d = new Date(date);
        return d.toLocaleDateString("it-IT", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }
};
//# sourceMappingURL=date.js.map