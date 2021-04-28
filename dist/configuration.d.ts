import { ILifeCycle, IMidwayContainer } from '@midwayjs/core';
export declare class ContainerLifeCycle implements ILifeCycle {
    onReady(container: IMidwayContainer): Promise<void>;
    onStop(container: IMidwayContainer): Promise<void>;
}
