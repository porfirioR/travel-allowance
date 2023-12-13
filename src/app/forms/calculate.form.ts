import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { DayItemForm } from "./day-item.form";

export interface CalculateForm {
  days: FormControl<number | null>,
  isSameDepartment: FormControl<boolean | null>
  totalDays: FormArray<FormGroup<DayItemForm>>
}
