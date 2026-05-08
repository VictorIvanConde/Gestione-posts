// definisco la struttura dello stato per le pagine della dashboard
// serve per passare i dati di navigazione e ricerca tra i componenti

export interface AdminState {
    sezioneAttiva: string;
    paginaCorrente: number;
    limite: number;
    ricerca: string;
}
