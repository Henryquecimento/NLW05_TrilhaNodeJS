import { getCustomRepository } from "typeorm";
import { ConnectionsRepository } from "../repositories/ConnectionsRepository";
import { Repository } from "typeorm";
import { Connection } from "../entities/Connection";

interface IConnectionCreate {
  id?: string;
  admin_id?: string;
  socket_id: string;
  user_id: string;
}

class ConnectionsService {
  private connectionRepository: Repository<Connection>;

  constructor() {
    this.connectionRepository = getCustomRepository(ConnectionsRepository);
  }

  async create({ id, admin_id, socket_id, user_id }: IConnectionCreate) {
    const connection = this.connectionRepository.create({
      id,
      admin_id,
      socket_id,
      user_id,
    });

    await this.connectionRepository.save(connection);

    return connection;
  }

  async findByUserId(user_id: string) {
    const connection = await this.connectionRepository.findOne({
      user_id,
    });

    return connection;
  }
}

export { ConnectionsService };
