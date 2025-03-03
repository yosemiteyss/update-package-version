import { Inputs, Git } from '../common';
export declare abstract class UpdateAction {
    private readonly git;
    constructor(git: Git);
    protected abstract updateVersion(version: string): Promise<void>;
    protected updateLockFile(): Promise<void>;
    run(inputs: Inputs): Promise<void>;
    private parseReleaseTagToVersion;
}
