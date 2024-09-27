import { BadRequestException, Injectable } from '@nestjs/common';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { BaseEntity } from '@base/base.entity';
import { LoggingService } from '@logging/logging.service';
import { IRecord } from '@share/common/common.interface';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Logger } from 'log4js';

enum IEntityStatus {
  EXISTED,
  NOT_EXIST,
}

@Injectable()
export class CrudBase<E extends BaseEntity> {
  protected readonly aliasUp: string;
  protected readonly aliasMultiple: string;
  protected readonly logger: Logger;

  constructor(
    protected readonly repository: Repository<E>,
    protected readonly alias: string,
    protected readonly loggingService: LoggingService,
  ) {
    this.aliasUp = this.alias.toUpperCase();
    this.aliasMultiple = this.alias.toLowerCase() + 's';
    this.logger = this.loggingService.getLogger(this.alias);
  }

  async list(): Promise<E[]> {
    this.logger.debug(`finding all ${this.alias}`);
    return this.repository.find();
  }

  async getOneBy(where: FindOptionsWhere<IRecord>): Promise<E> {
    this.logger.debug(`getOne ${this.alias}`);
    return this.repository.findOneBy(where);
  }

  async checkExist(
    where: FindOptionsWhere<IRecord>,
    errorCode: string,
    existed: IEntityStatus = IEntityStatus.NOT_EXIST,
  ): Promise<boolean> {
    const count = await this.repository.countBy(where);

    if (existed && !count) {
      const message = `${errorCode}.NOT_EXIST`;
      this.logger.error(message);
      throw new BadRequestException(message);
    }

    if (!existed && count) {
      const message = `${errorCode}.EXISTED`;
      this.logger.error(message);
      throw new BadRequestException(`${errorCode}.EXISTED`);
    }
    return true;
  }

  async create<T extends DeepPartial<E>>(dto: T): Promise<E> {
    this.logger.debug(`create ${this.alias}`);
    dto = await this.actionPreCreate(dto);
    const data = await this.repository.save(dto);
    await this.actionPostCreate(dto);

    return data;
  }

  async update<T extends QueryDeepPartialEntity<E>>(
    where: FindOptionsWhere<IRecord>,
    dto: T,
  ): Promise<E> {
    this.logger.debug(`updateOne ${this.alias}`);
    dto = await this.actionPreUpdate(where, dto);
    await this.repository.update(where, dto);
    const data = await this.getOneBy(where);
    await this.actionPostUpdate(where, dto);
    return data;
  }

  async delete(where: FindOptionsWhere<IRecord>) {
    this.logger.debug(`deleteOne ${this.alias}`);
    return this.repository.delete(where);
  }

  protected async actionPreCreate<T extends DeepPartial<E>>(dto: T) {
    return dto;
  }

  protected async actionPostCreate<T extends DeepPartial<E>>(dto: T) {
    return dto;
  }

  protected async actionPreUpdate<T extends QueryDeepPartialEntity<E>>(
    where: FindOptionsWhere<IRecord>,
    dto: T,
  ) {
    return dto;
  }

  protected async actionPostUpdate<T extends QueryDeepPartialEntity<E>>(
    where: FindOptionsWhere<IRecord>,
    dto: T,
  ) {
    return dto;
  }
}
