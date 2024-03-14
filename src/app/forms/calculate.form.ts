import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { DayItemForm } from "./day-item.form";

export interface CalculateForm {
  days: FormControl<number | null>,
  isSameDepartment: FormControl<boolean | null>
  departmentId: FormControl<number | null>
  totalDays: FormArray<FormGroup<DayItemForm>>
  totalAmount: FormControl<number | null>
  seventyTotalAmount: FormControl<number | null>
  amountToBeRendered: FormControl<number | null>
}
