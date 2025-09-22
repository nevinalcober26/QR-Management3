export type ElementType = 'round-table' | 'square-table' | 'rectangle-table' | 'wall' | 'door' | 'plant';

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
}

export interface TableElement extends BaseElement {
  type: 'round-table' | 'square-table' | 'rectangle-table';
  seats: number;
  tableName?: string;
  radius?: number;
}

export interface PlantElement extends BaseElement {
  type: 'plant';
  radius: number;
}

export type FloorElement = TableElement | PlantElement | BaseElement;
