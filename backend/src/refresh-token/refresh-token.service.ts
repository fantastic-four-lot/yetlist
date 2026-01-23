import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MongoRepository } from "typeorm";
import { RefreshToken } from "./refresh-token.entity";
import { ObjectId } from "mongodb";

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly repo: MongoRepository<RefreshToken>,
  ) {}

  create(userId: ObjectId, tokenHash: string) {
    return this.repo.save({
      userId,
      tokenHash,
      revoked: false,
      expiresAt: new Date(
      Date.now() + 90 * 24 * 60 * 60 * 1000 // 30 days sliding window

    ),
    });
  }

 findActive(userId: ObjectId) {
  return this.repo.findOne({
    where: {
      userId,
      revoked: false,
      expiresAt: { $gt: new Date() }, // 🔥 critical
    },
  });
}


  revoke(id: ObjectId) {
    return this.repo.update(id, { revoked: true });
  }

  revokeAll(userId: ObjectId) {
    return this.repo.updateMany(
      { userId, revoked: false },
      { $set: { revoked: true } },
    );
  }
}
