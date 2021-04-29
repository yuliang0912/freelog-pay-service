import {EntityModel} from '@midwayjs/orm';
import {PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, Index} from 'typeorm';
import {omit} from 'lodash';
import {AccountTypeEnum} from '../enum';

/**
 * 平台代币账户
 */
@EntityModel('accounts')
export class AccountInfo {

    /**
     * 账户ID
     */
    @PrimaryColumn({type: 'varchar', length: 32, comment: '账户ID'})
    accountId: number;

    /**
     * 账户名(默认使用所属人名称)
     */
    @Column({type: 'varchar', default: '', length: 32, comment: '账户名'})
    accountName: string;

    /**
     * 账户所属人类型(1:用户账户 2:节点账户 3:合约账户)
     */
    @Column({type: 'int', comment: '账户类型'})
    accountType: AccountTypeEnum;

    /**
     * 账户所属者ID(用户ID,节点ID,合约ID)
     */
    @Index()
    @Column({type: 'varchar', comment: '账户所属者ID'})
    ownerId: string;

    /**
     * 账户所属者用户名
     */
    @Column({type: 'varchar', default: '', comment: '账户所属者用户名'})
    ownerName: string;

    /**
     * 账户所属人用户ID
     */
    @Column({type: 'int', default: 0, comment: '账户所属人用户ID'})
    ownerUserId: number;

    /**
     * 账户余额(最小货币单位)
     */
    @Column({type: 'decimal', default: 0, precision: 10, scale: 2, comment: '账户余额(最小货币单位)'})
    balance: string;

    /**
     * 冻结金额(冻结的金额)
     */
    @Column({type: 'decimal', default: 0, precision: 10, scale: 2, comment: '冻结金额'})
    freezeBalance: string;

    /**
     * 普通账号存储6位数字密码加密之后的文本,合约账户存储公钥信息.
     */
    @Column({type: 'varchar', length: 1024, comment: '密码'})
    password: string;

    /**
     * 加密盐值
     */
    @Column({type: 'varchar', length: 256, comment: '加密盐值'})
    saltValue: string;

    /**
     * 数据签名
     */
    @Column({type: 'varchar', length: 256, comment: '数据签名'})
    signature: string;

    /**
     * 状态 1:正常 2:冻结
     */
    @Column({type: 'int', default: 1, comment: '状态 0:未激活 1:正常 2:冻结'})
    status: number;

    /**
     * 创建时间
     */
    @CreateDateColumn({comment: '创建时间'})
    createDate: Date;

    /**
     * 更新时间
     */
    @UpdateDateColumn({comment: '更新时间'})
    updateDate: Date;

    /**
     * 自定义序列化
     */
    toJSON(this: AccountInfo) {
        return omit(this, ['password', 'signature', 'saltValue']);
    }
}
