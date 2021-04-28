import { IMethodAspect, JoinPoint } from '@midwayjs/decorator';
import { AccountInfoController } from '../controller/account-info';
import { TransactionInfoController } from '../controller/transaction-info';
export declare class ResponseHandler implements IMethodAspect {
    before(point: JoinPoint): Promise<void>;
    afterReturn(joinPoint: JoinPoint, result: any): any;
    static get scopeControllers(): (typeof AccountInfoController | typeof TransactionInfoController)[];
}
