import Dexie from 'dexie';

export interface Stop {
  id: string;
  name: string;
}

export interface Route {
  id: string;
  number: string;
}

class BusDB extends Dexie {
  stops: Dexie.Table<Stop, string>;
  routes: Dexie.Table<Route, string>;
  meta: Dexie.Table<{ key: string; value: string }, string>;

  constructor() {
    super('BusDB');
    this.version(1).stores({
      stops: 'id',
      routes: 'id',
      meta: 'key',
    });

    this.stops = this.table('stops');
    this.routes = this.table('routes');
    this.meta = this.table('meta');
  }
}

export const busDB = new BusDB();
