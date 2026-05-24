export interface Room {
  id: string;
  name: string;
  householdId: string;
}

export interface Section {
  id: string;
  name: string;
  workplaceId: string;
}

export interface Container {
  id: string;
  name: string;
  number?: number;
  image?: string;
  roomId?: string;
  sectionId?: string;
  room?: Room;
  section?: Section;
}

export interface Objects {
  id: string;
  name: string;
  quantity: number;
  category?: string;
  image?: string;
  containerId: string;
  container?: Container;
}
