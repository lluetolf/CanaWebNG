import {BaseEntity} from "../global/base-entity";

export interface Field extends BaseEntity{
  id: number;
  name: string;
  ownerId: number;
  size: number;
  cultivatedArea: number;
  acquisitionDate: Date;
  ingenioId: string;
  lastUpdated: Date;
}

