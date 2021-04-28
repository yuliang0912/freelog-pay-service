import {Aspect, IMethodAspect, isPromise, JoinPoint, Provide} from '@midwayjs/decorator';
import {RetCodeEnum, ErrCodeEnum} from 'egg-freelog-base';
import {buildApiFormatData} from 'egg-freelog-base/lib/freelog-common-func';
import {AccountInfoController} from '../controller/account-info';
import {TransactionInfoController} from '../controller/transaction-info';

@Provide()
@Aspect(ResponseHandler.scopeControllers)
export class ResponseHandler implements IMethodAspect {
    async before(point: JoinPoint) {

    }

    afterReturn(joinPoint: JoinPoint, result: any) {
        if (isPromise(result)) {
            return result.then(data => buildApiFormatData(RetCodeEnum.success, ErrCodeEnum.success, 'success', data));
        }
        return buildApiFormatData(RetCodeEnum.success, ErrCodeEnum.success, 'success', result);
    }

    static get scopeControllers() {
        return [AccountInfoController, TransactionInfoController];
    }
}
