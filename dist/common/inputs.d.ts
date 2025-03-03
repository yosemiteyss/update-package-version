export interface Inputs {
    readonly runtime: string;
    readonly releaseTag: string;
    readonly commitUserEmail: string;
    readonly commitUserName: string;
    readonly commitMessage: string;
}
export declare function getInputs(): Inputs;
