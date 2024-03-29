import {BaseEntity} from "../global/base-entity";

export interface Field extends BaseEntity {
  id: string;
  name: string;
  owner: string;
  size: number;
  cultivatedArea: number;
  acquisitionDate: Date;
  ingenioId: IngenioId[];
  lastUpdated: Date;
}



export interface IngenioId {
  ingenioId: string;
  size: number;
}

