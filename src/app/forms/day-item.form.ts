import { FormControl } from "@angular/forms";

export interface DayItemForm {
  departmentId: FormControl<number | null>
  amount: FormControl<number | null>
  capitalDistrictAmount: FormControl<number | null>
  isCapitalDistrict: FormControl<boolean | null>
}
