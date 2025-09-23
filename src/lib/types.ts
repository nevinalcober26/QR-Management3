export type ElementType = 'round-table' | 'square-table' | 'rectangle-table' | 'wall' | 'door' | 'plant' | 'window' | 'l-shape' | 'curved-l-shape' | 'text' | 'rectangle' | 'circle';

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
  borderRadius?: number;
}

export interface TableElement extends BaseElement {
  type: 'round-table' | 'square-table' | 'rectangle-table';
  seats: number;
  tableName: string;
  radius?: number;
}

export interface PlantElement extends BaseElement {
  type: 'plant';
  radius: number;
}

export interface DoorElement extends BaseElement {
  type: 'door';
  label?: string;
}

export interface WindowElement extends BaseElement {
    type: 'window';
}

export interface TextElement extends BaseElement {
  type: 'text';
  text: string;
  fontSize: number;
}

export type FloorElement = TableElement | PlantElement | DoorElement | WindowElement | TextElement | BaseElement;
