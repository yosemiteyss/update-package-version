import { UpdateAction } from './update-action';
export declare class DartUpdateAction extends UpdateAction {
    protected updateVersion(version: string): Promise<void>;
    private readPubspecYaml;
    private writePubspecYaml;
}
