import { FormControl } from "@angular/forms";

export interface DayItemForm {
  id: FormControl<number | null>
  departmentId: FormControl<number | null>
  amount: FormControl<number | null>
  capitalDistrictAmount: FormControl<number | null>
  isCapitalDistrict: FormControl<boolean | null>
}
