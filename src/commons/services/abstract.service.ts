import { ClientFilterInput } from '~/commons/graphql/types-and-inputs/client-filter.input';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Document, Model } from 'mongoose';
import {
    IDeleteResult,
    IUpdateResult,
} from '~/commons/typings/mongoose.typings';
import { AnyObject } from '~/commons/typings/typescript';
import { ObjectId } from 'bson';
import {
    mergeQueryFilters,
    normalizeClientFilterForCount,
    normalizeClientFilterForSearch,
} from '~/commons/utils';
import { FindManyResult } from '../database/typings/find-many-result.interface';

export abstract class AbstractService<T extends Document> {
    private abstractModel: Model<T>;

    protected constructor(model: Model<T>) {
        this.abstractModel = model;
    }

    public async insertOne(payload: AnyObject): Promise<T> {
        const course = await this.abstractModel.create(payload);
        return course.save();
    }

    public async insertMany(payload: AnyObject[]): Promise<any> {
        return this.abstractModel.insertMany(payload);
    }

    public async upsertOne(
        queryFilter: AnyObject,
        payload: AnyObject,
    ): Promise<T> {
        return this.abstractModel.findOneAndUpdate(queryFilter, payload, {
            upsert: true,
            new: true,
            useFindAndModify: false,
            setDefaultsOnInsert: true,
        });
    }

    public async findOne(queryFilter: AnyObject): Promise<T> {
        const found = await this.abstractModel.findOne(queryFilter);
        return found || null;
    }

    public async findLastUpdated(queryFilter: AnyObject): Promise<T> {
        const latest = await this.abstractModel
            .find(queryFilter)
            .sort({ updatedAt: -1 })
            .limit(1);

        return latest && latest.length > 0 ? latest[0] : null;
    }

    public async findMany(
        queryFilter: AnyObject,
        clientFilter: ClientFilterInput = {},
    ): Promise<FindManyResult<T>> {
        const { offset, limit, filter, orderBy } = normalizeClientFilterForSearch(
            clientFilter,
        );
        const filterWith = mergeQueryFilters(queryFilter, filter);
        const totalRecords: number = await this.abstractModel.count(filterWith);
        const records: T[] = await this.abstractModel
            .find(filterWith)
            .sort({
                [orderBy.property]: orderBy.direction,
            })
            .skip(offset)
            .limit(limit);
        const results: FindManyResult<T> = {
            records: records,
            recordsLength: records.length,
            totalRecords: totalRecords,
            offset: offset,
            limit: limit,
            pages: Math.ceil(totalRecords / limit),
            currentPage: Math.ceil((offset + records.length) / limit),
        } as FindManyResult<T>;
        return results;
    }

    public async find(
        queryFilter: AnyObject,
        clientFilter: ClientFilterInput = {},
    ): Promise<T[]> {
        const { offset, limit, filter, orderBy } = normalizeClientFilterForSearch(
            clientFilter,
        );
        const filterWith = mergeQueryFilters(queryFilter, filter);
        return this.abstractModel
            .find(filterWith)
            .sort({
                [orderBy.property]: orderBy.direction,
            })
            .skip(offset)
            .limit(limit);
    }

    public async findManyByIds(
        ids: string[],
        clientFilter?: ClientFilterInput,
    ): Promise<T[]> {
        const { offset, limit, orderBy } = normalizeClientFilterForSearch(
            clientFilter,
        );
        return this.abstractModel
            .find({
                _id: {
                    $in: ids,
                },
            })
            .sort({
                [orderBy.property]: orderBy.direction,
            })
            .skip(offset)
            .limit(limit);
    }

    public async findOneById(id: string): Promise<T> {
        return this.abstractModel.findById(id);
    }

    public async findOneByIdOrFail(id: string): Promise<T> {
        return this.findOneOrFail({ _id: id });
    }

    public async failIfFoundById(id: string): Promise<void> {
        const found = await this.findOneById(id);
        if (found) {
            throw new ConflictException();
        }
    }

    public async failIfFound(
        queryFilter,
        opts?: ClientFilterInput,
    ): Promise<void> {
        const found = await this.findMany(queryFilter, opts);
        if (found.records.length > 0) {
            throw new ConflictException();
        }
    }

    public async removeOneById(id: string): Promise<boolean> {
        const result: IDeleteResult = await this.abstractModel.remove({
            _id: id,
        });
        return Boolean(result.ok);
    }

    public async removeOneByIdOrFail(id: string): Promise<boolean> {
        return this.removeOneOrFail({ _id: id });
    }

    public async removeOneOrFail(queryFilter: AnyObject): Promise<boolean> {
        const result: IDeleteResult = await this.abstractModel.deleteOne(
            queryFilter,
        );
        if (result.deletedCount === 0) {
            throw new NotFoundException();
        }
        return Boolean(result.ok);
    }

    public async findOneOrFail(queryFilter: AnyObject): Promise<T> {
        const found = await this.abstractModel.findOne(queryFilter);
        if (!found) {
            throw new NotFoundException();
        }
        return found;
    }
    public async updateOneById(id: string, payload: AnyObject): Promise<T> {
        const result: T = await this.abstractModel.findOneAndUpdate(
            { _id: id },
            payload,
            {
                new: true,
                useFindAndModify: false,
                setDefaultsOnInsert: true,
            },
        );
        if (!result) {
            throw new NotFoundException();
        }
        return result;
    }

    public async addChildToArray<A>(
        parentId: string,
        arrayField: string,
        childDoc: object,
    ): Promise<A> {
        try {
            const updated = await this.abstractModel.findByIdAndUpdate(
                parentId,
                { $addToSet: { [arrayField]: childDoc } },
                { new: true },
            );
            return updated[arrayField].pop() as A;
        } catch (e) {
            throw new NotFoundException();
        }
    }

    public async removeChildFromArrayById(
        parentId: string,
        arrayField: string,
        childId: string,
    ): Promise<boolean> {
        const parent = await this.abstractModel.findOne({ _id: parentId });
        const childIndex = parent[arrayField].findIndex(
            child => child.id === childId,
        );
        if (childIndex === -1) {
            throw new NotFoundException();
        }
        parent[arrayField].splice(childIndex, 1);
        await parent.save();
        return true;
    }
    public async removeChildFromArray(
        parentId: string,
        arrayField: string,
        childValue: string,
    ): Promise<boolean> {
        const parent = await this.abstractModel.findOne({ _id: parentId });
        const childIndex = parent[arrayField].findIndex(
            child => child.toString() === childValue,
        );
        if (childIndex === -1) {
            throw new NotFoundException();
        }
        parent[arrayField].splice(childIndex, 1);
        await parent.save();
        return true;
    }

    public async findChildFromArrayOrFail(
        parentId: string,
        arrayField: string,
        childId: string,
    ): Promise<any> {
        const parent = await this.abstractModel.findOne({ _id: parentId });
        const childFound = parent[arrayField].find(child => child.id === childId);
        if (childFound === undefined) {
            throw new NotFoundException();
        }
        return childFound;
    }

    public async updateChildInArray(
        parentId: string,
        arrayField: string,
        childId: string,
        childDoc: object,
    ): Promise<boolean> {
        const parent = await this.abstractModel.findOne({ _id: parentId });
        const childIndex = parent[arrayField].findIndex(
            child => child.id === childId,
        );
        if (childIndex === -1) {
            throw new NotFoundException();
        }
        parent[arrayField].splice(
            childIndex,
            1,
            Object.assign(childDoc, { _id: childId }),
        );
        await parent.save();
        return true;
    }

    public async addToSet(
        queryFilter: AnyObject,
        setProp: string,
        value: string,
    ): Promise<boolean> {
        const result: IUpdateResult = await this.abstractModel.updateOne(
            queryFilter,
            { $addToSet: { [setProp]: value } },
        );
        return Boolean(result.ok);
    }

    public async updateMany(
        queryFilter: AnyObject,
        payload: AnyObject,
        clientFilter?: ClientFilterInput,
    ): Promise<IUpdateResult> {
        const { offset, limit, orderBy } = normalizeClientFilterForSearch(
            clientFilter,
        );
        const result: IUpdateResult = await this.abstractModel
            .updateMany(queryFilter, payload)
            .sort({
                [orderBy.property]: orderBy.direction,
            })
            .skip(offset)
            .limit(limit);

        return result;
    }

    public async findManyAndUpdate(
        queryFilter: AnyObject,
        payload: AnyObject,
        opts?: ClientFilterInput,
    ): Promise<FindManyResult<T>> {
        await this.updateMany(queryFilter, payload, opts);
        return this.findMany(queryFilter, opts);
    }

    public async count(
        queryFilter: AnyObject = {},
        clientFilter: ClientFilterInput = {},
    ): Promise<number> {
        const { offset, limit, filter, orderBy } = normalizeClientFilterForCount(
            clientFilter,
        );
        const filterWith = mergeQueryFilters(queryFilter, filter);
        return this.abstractModel
            .countDocuments(filterWith)
            .sort({
                [orderBy.property]: orderBy.direction,
            })
            .skip(offset)
            .limit(limit);
    }

    public copyDocument(doc: T): T {
        doc._id = new ObjectId();
        doc.isNew = true; // Important!
        return doc;
    }

    public async cloneById(id: string): Promise<T> {
        const doc = await this.findOneById(id);
        const newDoc = this.copyDocument(doc);
        return newDoc.save();
    }

    public async cloneByIdOrFail(id: string): Promise<T> {
        const doc = await this.findOneByIdOrFail(id);
        const newDoc = this.copyDocument(doc);
        return newDoc.save();
    }
    public async updatedGrandchildToLiteralSet(
        parentId: string,
        arrayField: string,
        arrayFieldNested: string,
        childId: string,
        grandChildId: string,
        grandChildDoc: object,
    ): Promise<boolean> {
        const parent = await this.abstractModel.findOne({ _id: parentId });
        const childIndex = parent[arrayField].findIndex(
            chld => chld.id === childId,
        );
        if (childIndex === -1) {
            throw new NotFoundException();
        }
        const child = parent[arrayField][childIndex];
        const grandChildIndex = child[arrayFieldNested].findIndex(
            grandChild => grandChild.id === grandChildId,
        );
        if (grandChildIndex === -1) {
            throw new NotFoundException();
        }
        child[arrayFieldNested].splice(
            grandChildIndex,
            1,
            Object.assign(grandChildDoc, { _id: grandChildId }),
        );
        await parent.save();
        return true;
    }
    public async addGrandchildToLiteralSet(
        parentId: string,
        arrayField: string,
        arrayFieldNested: string,
        childId: string,
        grandchildLiteral: any,
    ): Promise<T> {
        const arrayToUpdate = arrayField + '.$.' + arrayFieldNested;

        const updated = await this.abstractModel.findOneAndUpdate(
            { _id: parentId, [arrayField]: { $elemMatch: { _id: childId } } },
            { $addToSet: { [arrayToUpdate]: grandchildLiteral } },
            { new: true },
        );
        return updated as T;
    }

    public async removeGrandchildFromLiteralSet(
        parentId: string,
        arrayField: string,
        arrayFieldNested: string,
        childId: string,
        grandchildLiteral: any,
    ): Promise<boolean> {
        const arrayToUpdate = arrayField + '.$.' + arrayFieldNested;
        const updated = await this.abstractModel.findOneAndUpdate(
            { _id: parentId, [arrayField]: { $elemMatch: { _id: childId } } },
            {
                $pull: {
                    [arrayToUpdate]: grandchildLiteral,
                },
            },
        );
        return true;
    }

    public async findGrandchildFromLiteralSet(
        arrayField: string,
        arrayFieldNested: string,
        grandchildField: string,
        grandchildLiteral: any,
    ): Promise<any> {
        const grandChildFound = await this.abstractModel.find({
            [arrayField]: {
                $elemMatch: {
                    [arrayFieldNested]: {
                        $elemMatch: { [grandchildField]: grandchildLiteral },
                    },
                },
            },
        });
        if (grandChildFound === undefined) {
            throw new NotFoundException();
        }
        return grandChildFound;
    }

    public async removeManyByIds(ids: string[]): Promise<number> {
        const result = await this.abstractModel.remove({
            _id: {
                $in: ids,
            },
        });
        return result.deletedCount;
    }

    public async removeMany(
        queryFilter: AnyObject,
        clientFilter: ClientFilterInput = {},
    ): Promise<number> {
        const { offset, limit, filter, orderBy } = normalizeClientFilterForSearch(
            clientFilter,
        );
        const filterWith = mergeQueryFilters(queryFilter, filter);
        const result = await this.abstractModel
            .remove(filterWith)
            .sort({
                [orderBy.property]: orderBy.direction,
            })
            .skip(offset)
            .limit(limit);
        return result.deletedCount;
    }
}
