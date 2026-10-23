import type { RemateRepository } from "../../domain/repositories/remate-repository.ts";
import type { DashboardStatsDto } from "../dtos/remate-dto.ts";

export class GetDashboardStats {
  private readonly remates: RemateRepository;

  constructor(remates: RemateRepository) {
    this.remates = remates;
  }

  execute(): Promise<DashboardStatsDto> {
    return this.remates.getStats();
  }
}
