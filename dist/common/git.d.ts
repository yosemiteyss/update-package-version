export declare class Git {
    setConfig(email: string, username: string): Promise<void>;
    checkout(branch: string): Promise<void>;
    listStagedFiles(): Promise<void>;
    addAllFiles(): Promise<void>;
    commit(message: string): Promise<void>;
    push(): Promise<void>;
    private getShortBranchName;
}
