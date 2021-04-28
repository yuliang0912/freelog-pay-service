import {Configuration} from '@midwayjs/decorator';
import * as orm from '@midwayjs/orm';
import {ILifeCycle, IMidwayContainer} from '@midwayjs/core';
import {KafkaClient} from './kafka/client';
// import * as assert from 'assert';

@Configuration({imports: [orm]})
export class ContainerLifeCycle implements ILifeCycle {

    onReady(container: IMidwayContainer): Promise<void> {
        // assert(true, '111');
        return container.getAsync('kafkaStartup');
    }

    async onStop(container: IMidwayContainer): Promise<void> {
        container.getAsync<KafkaClient>('kafkaClient').then(kafkaClient => {
            kafkaClient.disconnect();
        });
    }
}
