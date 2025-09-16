import { T3Server } from "../ttapi";

export class T3AbstractOps<T> {
  m_server: T3Server;
  m_info: T;
  constructor(server: T3Server, info: T) {
    this.m_server = server;
    this.m_info = info;
  }
}
