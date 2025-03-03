import { UpdateAction } from './update-action';
export declare class NodeUpdateAction extends UpdateAction {
    protected updateVersion(version: string): Promise<void>;
    protected updateLockFile(): Promise<void>;
    private readPackageJson;
    private writePackageJson;
}
