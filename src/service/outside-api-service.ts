import {FreelogContext} from 'egg-freelog-base';
import {NodeInfo, UserInfo} from '../interface';
import {Provide, Inject} from '@midwayjs/decorator';

@Provide()
export class OutsideApiService {

    @Inject()
    ctx: FreelogContext;

    /**
     * 获取用户信息
     * @param {number} userId
     */
    async getUserInfo(userId: number): Promise<UserInfo> {
        return this.ctx.curlIntranetApi(`${this.ctx.webApi.userInfo}/${userId}`);
    }

    /**
     * 获取节点信息
     * @param {number} nodeId
     */
    async getNodeInfo(nodeId: number): Promise<NodeInfo> {
        return this.ctx.curlIntranetApi(`${this.ctx.webApi.nodeInfoV2}/${nodeId}`);
    }

    /**
     * 获取合约信息
     * @param contractId
     */
    async getContractInfo(contractId: string): Promise<any> {
        return this.ctx.curlIntranetApi(`${this.ctx.webApi.contractInfoV2}/${contractId}`);
    }
}
