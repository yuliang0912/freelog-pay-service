/// <reference types="lodash" />
import { AccountTypeEnum } from '../enum';
/**
 * 平台代币账户
 */
export declare class AccountInfo {
    /**
     * 账户ID
     */
    accountId: number;
    /**
     * 账户名(默认使用所属人名称)
     */
    accountName: string;
    /**
     * 账户所属人类型(1:用户账户 2:节点账户 3:合约账户)
     */
    accountType: AccountTypeEnum;
    /**
     * 账户所属者ID(用户ID,节点ID,合约ID)
     */
    ownerId: string;
    /**
     * 账户所属者用户名
     */
    ownerName: string;
    /**
     * 账户所属人用户ID
     */
    ownerUserId: number;
    /**
     * 账户余额(最小货币单位)
     */
    balance: string;
    /**
     * 冻结金额(冻结的金额)
     */
    freezeBalance: string;
    /**
     * 密码(6位数字密码加密之后的文本)
     */
    password: string;
    /**
     * 加密盐值
     */
    saltValue: string;
    /**
     * 数据签名
     */
    signature: string;
    /**
     * 状态 1:正常 2:冻结
     */
    status: number;
    /**
     * 创建时间
     */
    createDate: Date;
    /**
     * 更新时间
     */
    updateDate: Date;
    /**
     * 自定义序列化
     */
    toJSON(this: AccountInfo): import("lodash").Omit<AccountInfo, "password" | "saltValue" | "signature">;
}
