import { AccountInfo } from '..';
import { AccountTypeEnum } from '../enum';
export declare class AccountHelper {
    /**
     * 生成加密盐值
     */
    generateSaltValue(): string;
    /**
     * 生成账户ID
     * @param accountType
     * @param ownerId
     */
    generateAccountId(accountType: AccountTypeEnum, ownerId: number | string): number;
    /**
     * 签名账户信息,后期可以考虑修改成RSA私钥签名,公钥校验
     * @param accountInfo
     */
    accountInfoSignature(accountInfo: AccountInfo): string;
    /**
     * 校验账户签名信息是否正确
     * @param accountInfo
     */
    accountSignatureVerify(accountInfo: AccountInfo): boolean;
    /**
     * 生成加密密码
     * @param accountId
     * @param accountSaltValue
     * @param ownerId
     * @param password
     */
    generateAccountPassword(accountId: number, accountSaltValue: string, ownerId: string, password: number): string;
    /**
     * 加密key(公钥,所以只用简单的做base64转换即可)
     * @param publicKey
     */
    encryptPublicKey(publicKey: string): string;
    /**
     * 解密publicKey
     * @param encryptedPublicKey
     */
    decryptPublicKey(encryptedPublicKey: string): string;
    /**
     * 校验账户交易密码
     * @param accountInfo
     * @param originalPassword
     */
    verifyAccountPassword(accountInfo: AccountInfo, originalPassword: number): boolean;
    /**
     * 根据账户类型获取号段范围
     * @param accountType
     */
    private static GetNumberSection;
    /**
     * 获取hashcode
     * @param string
     */
    private static GetHashCode;
}
