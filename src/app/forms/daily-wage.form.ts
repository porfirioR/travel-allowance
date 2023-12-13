import { FormControl } from "@angular/forms";

export interface DailyWageForm {
  id: FormControl<string | null>
  amount: FormControl<number | null>
  total100: FormControl<number | null>
  total80: FormControl<number | null>
  total40: FormControl<number | null>
}
