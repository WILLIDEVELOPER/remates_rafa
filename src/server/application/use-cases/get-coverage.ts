import type {
  DepartamentoCount,
  RemateRepository,
} from "../../domain/repositories/remate-repository.ts";

export class GetCoverage {
  private readonly remates: RemateRepository;

  constructor(remates: RemateRepository) {
    this.remates = remates;
  }

  execute(): Promise<DepartamentoCount[]> {
    return this.remates.countByDepartamento();
  }
}
