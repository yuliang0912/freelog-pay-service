import {EntityModel} from '@midwayjs/orm';
import {Column, CreateDateColumn, UpdateDateColumn, Index, PrimaryColumn} from 'typeorm';
import {omit} from 'lodash';
import {AccountTypeEnum, TransactionStatusEnum, TransactionTypeEnum} from '../enum';
import {TransactionAttachInfo} from '..';

/**
 * 交易明细.一次交易对应两条流水明细.即交易的双方各产生一条记录
 */
@EntityModel('account-transaction-details')
export class TransactionDetailInfo {

    /**
     * 明细流水ID(雪花算法)
     */
    @PrimaryColumn({type: 'bigint', comment: '流水ID'})
    serialNo: string;

    /**
     * 交易记录ID
     */
    @Column({type: 'bigint', comment: '交易记录ID'})
    transactionRecordId: string;

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
     * 交易前的余额
     */
    @Column({type: 'decimal', precision: 10, scale: 2, comment: '交易前的余额'})
    beforeBalance: string;

    /**
     * 交易后的余额
     */
    @Column({type: 'decimal', precision: 10, scale: 2, comment: '交易后的余额'})
    afterBalance: string;

    /**
     * 交易类型
     */
    @Column({type: 'int', default: 1, comment: '交易类型'})
    transactionType: TransactionTypeEnum;

    /**
     * 摘要
     */
    @Column({type: 'varchar', default: '', length: 256, comment: '摘要'})
    digest: string;

    /**
     * 备注
     */
    @Column({type: 'varchar', default: '', length: 256, comment: '备注'})
    remark: string;

    /**
     * JSON
     */
    @Column({type: 'json', comment: '摘要'})
    attachInfo: TransactionAttachInfo;

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
     * 状态 1:交易确认中 2:交易成功 3:交易取消 4:交易失败
     */
    @Column({type: 'int', default: 1, comment: '状态 1:交易确认中 2:交易成功 3:交易取消 4:交易失败'})
    status: TransactionStatusEnum;

    /**
     * 自定义序列化
     */
    toJSON(this: TransactionDetailInfo) {
        return omit(this, ['signature', 'saltValue']);
    }
}
