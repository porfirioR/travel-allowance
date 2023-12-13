import { FormControl } from "@angular/forms";

export interface DayItemForm {
  departmentId: FormControl<number | null>
  amount: FormControl<number | null>
}
