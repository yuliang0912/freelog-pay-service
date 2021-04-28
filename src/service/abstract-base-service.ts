import {Repository} from '..';
import {isArray, isString} from 'lodash';
import {FindConditions} from 'typeorm/find-options/FindConditions';
import {FindOneOptions} from 'typeorm/find-options/FindOneOptions';
import {QueryDeepPartialEntity} from 'typeorm/query-builder/QueryPartialEntity';
import {FindManyOptions} from 'typeorm/find-options/FindManyOptions';
import {SelectQueryBuilder} from 'typeorm/query-builder/SelectQueryBuilder';
import {PageResult} from 'egg-freelog-base';

export class BaseService<Entity> {

    tableAlias: string;
    repository: Repository<Entity>;

    /**
     * SQL语句构建器
     */
    get queryBuild(): SelectQueryBuilder<Entity> {
        return this.repository.createQueryBuilder(this.tableAlias);
    }

    count(options?: FindManyOptions<Entity>): Promise<number>;
    count(conditions?: FindConditions<Entity>): Promise<number>;
    count(options?: FindManyOptions<Entity> | FindConditions<Entity>): Promise<number> {
        return this.repository.count(options);
    }

    find(options?: FindManyOptions<Entity>): Promise<Entity[]>;
    find(conditions?: FindConditions<Entity>): Promise<Entity[]>;
    find(options?: FindManyOptions<Entity> | FindConditions<Entity>): Promise<Entity[]> {
        return this.repository.find(options);
    }

    findAndCount(options?: FindManyOptions<Entity>): Promise<[Entity[], number]>;
    findAndCount(conditions?: FindConditions<Entity>): Promise<[Entity[], number]>;
    findAndCount(options?: FindManyOptions<Entity> | FindConditions<Entity>): Promise<[Entity[], number]> {
        return this.repository.findAndCount(options);
    }

    findByIds(ids: any[], options?: FindManyOptions<Entity>): Promise<Entity[]>;
    findByIds(ids: any[], conditions?: FindConditions<Entity>): Promise<Entity[]>;
    findByIds(ids: any[], options?: FindManyOptions<Entity> | FindConditions<Entity>): Promise<Entity[]> {
        return this.repository.findByIds(ids, options);
    }

    findOne(id?: string | number | Date, options?: FindOneOptions<Entity>): Promise<Entity | undefined>;
    findOne(options?: FindOneOptions<Entity>): Promise<Entity | undefined>;
    findOne(conditions?: FindConditions<Entity>, options?: FindOneOptions<Entity>): Promise<Entity | undefined>;
    findOne(id?: string | number | Date | FindOneOptions<Entity> | FindConditions<Entity>, options?: FindOneOptions<Entity>): Promise<Entity | undefined> {
        return this.repository.findOne(id as any, options);
    }

    findPageList(conditions: FindManyOptions<Entity>): Promise<PageResult<Entity>> {
        conditions.skip = conditions.skip ?? 0;
        conditions.take = conditions.take ?? 10;
        return this.findAndCount(conditions).then(([dataList, totalItem]) => {
            return {skip: conditions.skip, limit: conditions.take, totalItem, dataList};
        });
    }

    insert(entity: QueryDeepPartialEntity<Entity> | QueryDeepPartialEntity<Entity>[]): Promise<boolean> {
        return this.repository.insert(entity).then(t => Boolean(t.identifiers.length));
    }

    query(query: string, parameters?: any[]): Promise<any> {
        return this.repository.query(query, parameters);
    }

    update(criteria: string | string[] | number | number[] | Date | Date[] | FindConditions<Entity>, partialEntity: QueryDeepPartialEntity<Entity>): Promise<boolean> {
        if (!partialEntity || !Object.keys(partialEntity).length) {
            return Promise.resolve(false);
        }
        return this.repository.update(criteria, partialEntity).then(t => Boolean(t.affected));
    }

    delete(criteria: string | string[] | number | number[] | Date | Date[] | FindConditions<Entity>): Promise<boolean> {
        return this.repository.delete(criteria).then(t => Boolean(t.affected));
    }

    /**
     * 构建select字段列表
     * @param select
     * @param IgnoreFields
     */
    buildSelectFields(select: string, IgnoreFields?: string[]): string;
    buildSelectFields(select: string[], IgnoreFields?: string[]): string[]
    buildSelectFields(select: any, IgnoreFields?: string[]) {
        if (isString(select) && !IgnoreFields?.includes(select)) {
            return `${this.tableAlias}.${select}`;
        } else if (isArray(select)) {
            return select.filter(m => !IgnoreFields?.includes(m)).map(x => `${this.tableAlias}.${x}`);
        }
        return select;
    }
}
