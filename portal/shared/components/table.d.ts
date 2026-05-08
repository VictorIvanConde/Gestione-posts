export declare const Table: {
    render(headers: string[], rows: (string | number)[][], actions?: (rowIndex: number) => string): string;
    highlight(text: string | number, query: string): string;
};
