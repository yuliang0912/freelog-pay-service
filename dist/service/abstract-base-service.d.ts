import { Repository } from '..';
import { FindConditions } from 'typeorm/find-options/FindConditions';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { PageResult } from 'egg-freelog-base';
export declare class BaseService<Entity> {
    tableAlias: string;
    repository: Repository<Entity>;
    /**
     * SQL语句构建器
     */
    get queryBuild(): SelectQueryBuilder<Entity>;
    count(options?: FindManyOptions<Entity>): Promise<number>;
    count(conditions?: FindConditions<Entity>): Promise<number>;
    find(options?: FindManyOptions<Entity>): Promise<Entity[]>;
    find(conditions?: FindConditions<Entity>): Promise<Entity[]>;
    findAndCount(options?: FindManyOptions<Entity>): Promise<[Entity[], number]>;
    findAndCount(conditions?: FindConditions<Entity>): Promise<[Entity[], number]>;
    findByIds(ids: any[], options?: FindManyOptions<Entity>): Promise<Entity[]>;
    findByIds(ids: any[], conditions?: FindConditions<Entity>): Promise<Entity[]>;
    findOne(id?: string | number | Date, options?: FindOneOptions<Entity>): Promise<Entity | undefined>;
    findOne(options?: FindOneOptions<Entity>): Promise<Entity | undefined>;
    findOne(conditions?: FindConditions<Entity>, options?: FindOneOptions<Entity>): Promise<Entity | undefined>;
    findPageList(conditions: FindManyOptions<Entity>): Promise<PageResult<Entity>>;
    insert(entity: QueryDeepPartialEntity<Entity> | QueryDeepPartialEntity<Entity>[]): Promise<boolean>;
    query(query: string, parameters?: any[]): Promise<any>;
    update(criteria: string | string[] | number | number[] | Date | Date[] | FindConditions<Entity>, partialEntity: QueryDeepPartialEntity<Entity>): Promise<boolean>;
    delete(criteria: string | string[] | number | number[] | Date | Date[] | FindConditions<Entity>): Promise<boolean>;
    /**
     * 构建select字段列表
     * @param select
     * @param IgnoreFields
     */
    buildSelectFields(select: string, IgnoreFields?: string[]): string;
    buildSelectFields(select: string[], IgnoreFields?: string[]): string[];
}
