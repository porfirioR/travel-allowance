export class DepartmentViewModel {
  constructor(
    public id: number,
    public name: string,
    public totalDay: number,
    public total100: number,
    public total80?: number,
    public total40?: number,
  ) {}
}
