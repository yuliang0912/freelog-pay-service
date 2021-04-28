import {EntityModel} from '@midwayjs/orm';
import {Column, CreateDateColumn, UpdateDateColumn, Index, PrimaryColumn} from 'typeorm';
import {omit} from 'lodash';
import {AccountTypeEnum, TransactionStatusEnum, TransactionTypeEnum} from '../enum';

/**
 * 交易操作记录信息,一次交易对应一条记录,一条记录一般对应两条流水
 */
@EntityModel('account-transaction-records')
export class TransactionRecordInfo {

    /**
     * 记录ID(雪花算法)
     */
    @PrimaryColumn({type: 'bigint', comment: '流水ID'})
    recordId: string;

    /**
     * 账户ID
     */
    @Index()
    @Column({type: 'varchar', length: 32, comment: '账户ID'})
    accountId: number;

    /**
     * 账户所属类型(1:用户账户 2:节点账户 3:合约账户)
     */
    @Column({type: 'int', comment: '账户类型'})
    accountType: AccountTypeEnum;

    /**
     * 账户名
     */
    @Column({type: 'varchar', default: '', length: 32, comment: '账户名'})
    accountName: string;

    /**
     * 对方账户ID
     */
    @Index()
    @Column({type: 'varchar', length: 32, comment: '对方账户ID'})
    reciprocalAccountId: number;

    /**
     * 账户所属人类型(1:用户账户 2:节点账户 3:合约账户)
     */
    @Column({type: 'int', comment: '账户类型'})
    reciprocalAccountType: AccountTypeEnum;

    /**
     * 对方账户名
     */
    @Column({type: 'varchar', length: 32, comment: '对方账户名'})
    reciprocalAccountName: string;

    /**
     * 交易金额
     */
    @Column({type: 'decimal', precision: 10, scale: 2, comment: '交易金额'})
    transactionAmount: number;

    /**
     * 交易类型
     */
    @Column({type: 'int', default: 1, comment: '交易类型'})
    transactionType: TransactionTypeEnum;

    /**
     * 摘要JSON
     */
    @Column({type: 'json', comment: '摘要'})
    attachInfo: object;

    /**
     * 备注
     */
    @Column({type: 'varchar', default: '', length: 256, comment: '备注'})
    remark: string;

    /**
     * 加密盐值
     */
    @Column({type: 'varchar', length: 1024, comment: '加密盐值'})
    saltValue: string;

    /**
     * 数据签名
     */
    @Column({type: 'varchar', length: 1024, comment: '数据签名'})
    signature: string;

    /**
     * 操作者ID(uid或contractId)
     */
    @Column({type: 'varchar', length: 64, comment: '操作者ID'})
    operatorId: string;

    /**
     * 操作者Name(username或contractName)
     */
    @Column({type: 'varchar', length: 256, comment: '操作者Name'})
    operatorName: string;

    /**
     * 授权方式(密码授权,密钥签名授权等)
     */
    @Column({type: 'varchar', length: 256, comment: '授权方式'})
    authorizationType: string;

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
     * 交易确认超时时间(如果没有服务对交易进行确认,则系统自动取消)
     */
    @Column({type: 'datetime', nullable: true, comment: '交易确认超时时间'})
    confirmTimeoutDate: Date;

    /**
     * 状态 1:交易确认中 2:交易成功 3:交易取消 4:交易失败
     */
    @Column({type: 'int', default: 1, comment: '状态 1:交易确认中 2:交易成功 3:交易取消 4:交易失败'})
    status: TransactionStatusEnum;

    /**
     * 自定义序列化
     */
    toJSON(this: TransactionRecordInfo) {
        return omit(this, ['signature', 'saltValue']);
    }
}
