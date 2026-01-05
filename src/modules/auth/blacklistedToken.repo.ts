import BlacklistedTokenModel from "./blacklistedTokens.model";

export class BlacklistedTokenRepo {
  async addToBlacklistDAL(token: string, expiresAt: Date) {
    return BlacklistedTokenModel.updateOne(
      { token },
      { $set: { token, expiresAt } },
      { upsert: true }
    ).exec();
  }

  async isBlacklistedDAL(token: string): Promise<boolean> {
    const exists = await BlacklistedTokenModel.exists({ token });
    return !!exists;
  }
}
