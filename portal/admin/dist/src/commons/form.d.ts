export declare const Form: {
    renderInput(label: string, id: string, type?: string, value?: string, placeholder?: string): string;
    renderTextarea(label: string, id: string, value?: string, rows?: number, placeholder?: string): string;
    renderSelect(label: string, id: string, options: {
        value: string;
        label: string;
    }[], selectedValue?: string): string;
    getData(ids: string[]): any;
};
