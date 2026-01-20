import { RefreshTokenModel } from "./refreshToken.model";
import crypto from "crypto";

export class RefreshTokenRepo {

  private hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  async createRefreshToken(userId: string, expiresInDays = 7): Promise<string> {
    const refreshToken = crypto.randomBytes(64).toString("hex");
    const tokenHash = this.hashToken(refreshToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    await RefreshTokenModel.create({
      userId,
      tokenHash,
      expiresAt,
      revoked: false
    });

    return refreshToken;
  }

  async findValid(refreshToken: string) {
    const tokenHash = this.hashToken(refreshToken);

    return RefreshTokenModel.findOne({
      tokenHash,
      revoked: false,
      expiresAt: { $gt: new Date() }
    });
  }

  async revoke(refreshToken: string) {
    const tokenHash = this.hashToken(refreshToken);

    await RefreshTokenModel.findOneAndUpdate(
      { tokenHash },
      { revoked: true }
    );
  }
}
