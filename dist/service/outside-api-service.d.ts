import { FreelogContext } from 'egg-freelog-base';
import { NodeInfo, UserInfo } from '../interface';
export declare class OutsideApiService {
    ctx: FreelogContext;
    /**
     * 获取用户信息
     * @param {number} userId
     */
    getUserInfo(userId: number): Promise<UserInfo>;
    /**
     * 获取节点信息
     * @param {number} nodeId
     */
    getNodeInfo(nodeId: number): Promise<NodeInfo>;
    /**
     * 获取合约信息
     * @param contractId
     */
    getContractInfo(contractId: string): Promise<any>;
}
